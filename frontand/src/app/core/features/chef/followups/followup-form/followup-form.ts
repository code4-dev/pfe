import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project.js';

import { FollowupService } from '../../../../services/followup.js';
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
  isEditing: boolean = false;
  projectId: string | null = null;
  followupId: string | null = null;
  submitted: boolean = false;
  projectName: string = '';

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.followupId = this.route.snapshot.paramMap.get('followupId');

    if (this.projectId) {
      const project = this.projectService.getProjectById(this.projectId);
      if (project) {
        this.projectName = project.name;
      }

      if (this.followupId) {
        this.isEditing = true;
        this.loadFollowup(this.followupId);
      }
    }
  }

  private initForm(): void {
    this.followupForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      progress: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      issues: [''],
      decisions: ['']
    });
  }

  private loadFollowup(id: string): void {
    const followup = this.followupService.getFollowupById(id);
    if (followup) {
      this.followupForm.patchValue({
        title: followup.title,
        description: followup.description,
        progress: followup.progress,
        issues: followup.issues,
        decisions: followup.decisions
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.followupForm.invalid || !this.projectId) {
      return;
    }

    const formValue = this.followupForm.value;
    const followupData = {
      projectId: this.projectId,
      title: formValue.title,
      description: formValue.description,
      progress: formValue.progress,
      issues: formValue.issues,
      decisions: formValue.decisions
    };

    if (this.isEditing && this.followupId) {
      this.followupService.updateFollowup(this.followupId, followupData);
    } else {
      this.followupService.createFollowup(followupData);
    }

    this.router.navigate(['/projects', this.projectId, 'followups']);
  }

  get f() {
    return this.followupForm.controls;
  }
}
