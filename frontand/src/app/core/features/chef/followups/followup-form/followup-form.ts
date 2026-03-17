import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project';
import { FollowupPayload, FollowupService, MaintenanceRequestType } from '../../../../services/followup';

@Component({
  selector: 'app-followup-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './followup-form.html',
  styleUrl: './followup-form.css',
})
export class FollowupForm implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private followupService = inject(FollowupService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  followupForm!: FormGroup;
  isEditing = false;
  projectId: string | null = null;
  followupId: string | null = null;
  submitted = false;
  projectName = '';

  requestTypeOptions: Array<{ value: MaintenanceRequestType; label: string }> = [
    { value: 'anomalie', label: 'Anomalie' },
    { value: 'amelioration', label: 'Amelioration' },
    { value: 'nouveau-besoin', label: 'Nouveau besoin' },
  ];

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.followupId = this.route.snapshot.paramMap.get('followupId');

    if (!this.projectId) {
      return;
    }

    this.projectService.getProjectByIdFromApi(this.projectId).subscribe({
      next: (project) => {
        this.projectName = project.name;
      },
      error: (err) => {
        console.error('Erreur chargement projet', err);
      }
    });

    if (this.followupId) {
      this.isEditing = true;
      this.loadFollowup(this.followupId);
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.followupForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      reportDate: [today],
      contractReference: [''],
      requester: [''],
      requestType: ['anomalie', Validators.required],
      procedureConcerned: [''],
      attachments: [''],
      issues: [''],
      feasibility: ['oui'],
      deliveryType: ['version'],
      diagnosticComment: [''],
      estimatedCharge: [''],
      estimatedDelay: [''],
      decisions: [''],
      decisionRmap: ['oui'],
      decisionDate: [''],
      sourceRequestDate: [''],
      sourceReceptionDate: [''],
      devEnvRequestDate: [''],
      devEnvOpenDate: [''],
      workSummary: [''],
      versionNumber: [''],
      testEnvRequestDate: [''],
      testEnvOpenDate: [''],
      workEndDate: [''],
      packageSendDate: [''],
      closureObservation: ['']
    });
  }

  private loadFollowup(id: string): void {
    if (!this.projectId) {
      return;
    }

    this.followupService.getFollowupById(this.projectId, id).subscribe({
      next: (followup) => {
        this.followupForm.patchValue({
          title: followup.title,
          description: followup.description,
          progress: followup.progress,
          reportDate: followup.reportDate ?? '',
          contractReference: followup.contractReference ?? '',
          requester: followup.requester ?? '',
          requestType: followup.requestType ?? 'anomalie',
          procedureConcerned: followup.procedureConcerned ?? '',
          attachments: followup.attachments ?? '',
          issues: followup.issues ?? '',
          feasibility: followup.feasibility ?? 'oui',
          deliveryType: followup.deliveryType ?? 'version',
          diagnosticComment: followup.diagnosticComment ?? '',
          estimatedCharge: followup.estimatedCharge ?? '',
          estimatedDelay: followup.estimatedDelay ?? '',
          decisions: followup.decisions ?? '',
          decisionRmap: followup.decisionRmap ?? 'oui',
          decisionDate: followup.decisionDate ?? '',
          sourceRequestDate: followup.sourceRequestDate ?? '',
          sourceReceptionDate: followup.sourceReceptionDate ?? '',
          devEnvRequestDate: followup.devEnvRequestDate ?? '',
          devEnvOpenDate: followup.devEnvOpenDate ?? '',
          workSummary: followup.workSummary ?? '',
          versionNumber: followup.versionNumber ?? '',
          testEnvRequestDate: followup.testEnvRequestDate ?? '',
          testEnvOpenDate: followup.testEnvOpenDate ?? '',
          workEndDate: followup.workEndDate ?? '',
          packageSendDate: followup.packageSendDate ?? '',
          closureObservation: followup.closureObservation ?? ''
        });
      },
      error: (err) => {
        console.error('Erreur chargement suivi', err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.followupForm.invalid || !this.projectId) {
      this.followupForm.markAllAsTouched();
      return;
    }

    const formValue = this.followupForm.value;
    const payload: FollowupPayload = {
      title: String(formValue.title ?? '').trim(),
      description: String(formValue.description ?? '').trim(),
      progress: Number(formValue.progress ?? 0),
      reportDate: this.emptyToUndefined(formValue.reportDate),
      contractReference: this.emptyToUndefined(formValue.contractReference),
      requester: this.emptyToUndefined(formValue.requester),
      requestType: formValue.requestType as MaintenanceRequestType,
      procedureConcerned: this.emptyToUndefined(formValue.procedureConcerned),
      attachments: this.emptyToUndefined(formValue.attachments),
      issues: this.emptyToUndefined(formValue.issues),
      feasibility: (this.emptyToUndefined(formValue.feasibility) as 'oui' | 'non' | undefined) ?? 'oui',
      deliveryType: (this.emptyToUndefined(formValue.deliveryType) as 'version' | 'patch' | undefined) ?? 'version',
      diagnosticComment: this.emptyToUndefined(formValue.diagnosticComment),
      estimatedCharge: this.emptyToUndefined(formValue.estimatedCharge),
      estimatedDelay: this.emptyToUndefined(formValue.estimatedDelay),
      decisions: this.emptyToUndefined(formValue.decisions),
      decisionRmap: (this.emptyToUndefined(formValue.decisionRmap) as 'oui' | 'non' | undefined) ?? 'oui',
      decisionDate: this.emptyToUndefined(formValue.decisionDate),
      sourceRequestDate: this.emptyToUndefined(formValue.sourceRequestDate),
      sourceReceptionDate: this.emptyToUndefined(formValue.sourceReceptionDate),
      devEnvRequestDate: this.emptyToUndefined(formValue.devEnvRequestDate),
      devEnvOpenDate: this.emptyToUndefined(formValue.devEnvOpenDate),
      workSummary: this.emptyToUndefined(formValue.workSummary),
      versionNumber: this.emptyToUndefined(formValue.versionNumber),
      testEnvRequestDate: this.emptyToUndefined(formValue.testEnvRequestDate),
      testEnvOpenDate: this.emptyToUndefined(formValue.testEnvOpenDate),
      workEndDate: this.emptyToUndefined(formValue.workEndDate),
      packageSendDate: this.emptyToUndefined(formValue.packageSendDate),
      closureObservation: this.emptyToUndefined(formValue.closureObservation)
    };

    if (this.isEditing && this.followupId) {
      this.followupService.updateFollowup(this.projectId, this.followupId, payload).subscribe({
        next: () => {
          this.router.navigate(['/projects', this.projectId, 'followups']);
        },
        error: (err) => {
          console.error('Erreur mise a jour suivi', err);
        }
      });
      return;
    }

    this.followupService.createFollowup(this.projectId, payload).subscribe({
      next: () => {
        this.router.navigate(['/projects', this.projectId, 'followups']);
      },
      error: (err) => {
        console.error('Erreur creation suivi', err);
      }
    });
  }

  get f() {
    return this.followupForm.controls;
  }

  private emptyToUndefined(value: unknown): string | undefined {
    const normalized = String(value ?? '').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  printPage(): void {
    window.print();
  }
}
