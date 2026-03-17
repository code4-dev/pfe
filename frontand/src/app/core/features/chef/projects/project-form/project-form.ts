import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectPayload, ProjectService } from '../../../../services/project';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projectForm!: FormGroup;
  isEditing = false;
  projectId: string | null = null;
  submitted = false;

  statusOptions = [
    { value: 'planification', label: 'Planification' },
    { value: 'en-cours', label: 'En cours' },
    { value: 'termine', label: 'Termine' },
    { value: 'suspendu', label: 'Suspendu' },
  ];

  projectTypeOptions = [
    { value: 'Nouveau', label: 'Nouveau' },
    { value: 'Evolution', label: 'Evolution' },
    { value: 'Refonte', label: 'Refonte' },
  ];
  projectCharacterOptions = [
    { value: 'National', label: 'National' },
    { value: 'Commun', label: 'Commun a l Administration' },
    { value: 'CNI', label: 'CNI' },
  ];
  developmentModeOptions = [
    { value: 'I', label: 'Interne (I)' },
    { value: 'ST', label: 'Sous-traitance (ST)' },
    { value: 'CO', label: 'Co-traitance (CO)' },
  ];
  planningRows = Array.from({ length: 8 }, (_, i) => i + 1);
  planningMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '..', '..'];
  private readonly requiredTrimmed: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    return value.trim().length > 0 ? null : { required: true };
  };

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditing = true;
      this.loadProject(this.projectId);
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, this.requiredTrimmed, Validators.minLength(3)]],
      description: ['', [Validators.required, this.requiredTrimmed, Validators.minLength(10)]],
      clientName: ['', [Validators.required, this.requiredTrimmed]],
      contractReference: [''],
      projectContext: ['Convention en cours', [Validators.required, this.requiredTrimmed]],
      projectCharacter: ['National', Validators.required],
      projectType: ['Nouveau', Validators.required],
      developmentMode: ['I', Validators.required],
      historical: [''],
      perimeter: ['', [Validators.required, this.requiredTrimmed]],
      projectOwner: ['', [Validators.required, this.requiredTrimmed]],
      projectLead: ['', [Validators.required, this.requiredTrimmed]],
      projectTeam: ['', [Validators.required, this.requiredTrimmed]],
      estimatedChargeHm: [null, [Validators.required, Validators.min(0)]],
      estimatedBudgetMd: [null, [Validators.required, Validators.min(0)]],
      estimatedDelayMonths: [null, [Validators.required, Validators.min(0)]],
      budgetChargeCp: [null, [Validators.min(0)]],
      budgetChargeId: [null, [Validators.min(0)]],
      budgetChargeTotal: [null, [Validators.min(0)]],
      budgetMdCp: [null, [Validators.min(0)]],
      budgetMdId: [null, [Validators.min(0)]],
      budgetMdTotal: [null, [Validators.min(0)]],
      potentialRisks: ['', [Validators.required, this.requiredTrimmed]],
      prerequisites: ['', [Validators.required, this.requiredTrimmed]],
      status: ['planification', Validators.required],
      dueDate: [today, Validators.required],
    });
  }

  private loadProject(id: string): void {
    this.projectService.getProjectByIdFromApi(id).subscribe({
      next: (project) => {
        const dueDateStr = new Date(project.dueDate).toISOString().split('T')[0];
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          clientName: project.clientName ?? '',
          contractReference: project.contractReference ?? '',
          projectContext: project.projectContext ?? 'Convention en cours',
          projectCharacter: project.projectCharacter ?? 'National',
          projectType: project.projectType ?? 'Nouveau',
          developmentMode: project.developmentMode ?? 'I',
          historical: project.historical ?? '',
          perimeter: project.perimeter ?? '',
          projectOwner: project.projectOwner ?? '',
          projectLead: project.projectLead ?? '',
          projectTeam: project.projectTeam ?? '',
          estimatedChargeHm: project.estimatedChargeHm ?? null,
          estimatedBudgetMd: project.estimatedBudgetMd ?? null,
          estimatedDelayMonths: project.estimatedDelayMonths ?? null,
          budgetChargeCp: project.budgetChargeCp ?? null,
          budgetChargeId: project.budgetChargeId ?? null,
          budgetChargeTotal: project.budgetChargeTotal ?? null,
          budgetMdCp: project.budgetMdCp ?? null,
          budgetMdId: project.budgetMdId ?? null,
          budgetMdTotal: project.budgetMdTotal ?? null,
          potentialRisks: project.potentialRisks ?? '',
          prerequisites: project.prerequisites ?? '',
          status: project.status,
          dueDate: dueDateStr,
        });
      },
      error: (err: unknown) => console.error('Erreur de chargement', err),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.value;
    const payload: ProjectPayload = {
      name: String(formValue.name ?? '').trim(),
      description: String(formValue.description ?? '').trim(),
      clientName: String(formValue.clientName ?? '').trim(),
      contractReference: this.emptyToUndefined(formValue.contractReference),
      projectContext: String(formValue.projectContext ?? '').trim(),
      projectCharacter: String(formValue.projectCharacter ?? '').trim(),
      projectType: String(formValue.projectType ?? '').trim(),
      developmentMode: String(formValue.developmentMode ?? '').trim(),
      historical: this.emptyToUndefined(formValue.historical),
      perimeter: String(formValue.perimeter ?? '').trim(),
      projectOwner: String(formValue.projectOwner ?? '').trim(),
      projectLead: String(formValue.projectLead ?? '').trim(),
      projectTeam: String(formValue.projectTeam ?? '').trim(),
      estimatedChargeHm: Number(formValue.estimatedChargeHm ?? 0),
      estimatedBudgetMd: Number(formValue.estimatedBudgetMd ?? 0),
      estimatedDelayMonths: Number(formValue.estimatedDelayMonths ?? 0),
      budgetChargeCp: this.numberOrUndefined(formValue.budgetChargeCp),
      budgetChargeId: this.numberOrUndefined(formValue.budgetChargeId),
      budgetChargeTotal: this.numberOrUndefined(formValue.budgetChargeTotal),
      budgetMdCp: this.numberOrUndefined(formValue.budgetMdCp),
      budgetMdId: this.numberOrUndefined(formValue.budgetMdId),
      budgetMdTotal: this.numberOrUndefined(formValue.budgetMdTotal),
      potentialRisks: String(formValue.potentialRisks ?? '').trim(),
      prerequisites: String(formValue.prerequisites ?? '').trim(),
      status: formValue.status as ProjectPayload['status'],
      dueDate: String(formValue.dueDate ?? ''),
    };

    if (this.isEditing && this.projectId) {
      this.projectService.updateProject(this.projectId, payload).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err: unknown) => console.error('Erreur update', err),
      });
    } else {
      this.projectService.createProject(payload).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err: unknown) => console.error('Erreur creation', err),
      });
    }
  }

  get f() {
    return this.projectForm.controls;
  }

  isProjectCharacter(value: string): boolean {
    return this.f['projectCharacter'].value === value;
  }

  setProjectCharacter(value: string, checked: boolean): void {
    if (checked) {
      this.f['projectCharacter'].setValue(value);
      return;
    }
    if (this.f['projectCharacter'].value === value) {
      this.f['projectCharacter'].setValue('');
    }
  }

  trackByRow(_: number, row: number): number {
    return row;
  }

  trackByMonth(index: number): number {
    return index;
  }

  printPage(): void {
    window.print();
  }

  private emptyToUndefined(value: unknown): string | undefined {
    const normalized = String(value ?? '').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private numberOrUndefined(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
}
