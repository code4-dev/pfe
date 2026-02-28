import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminService,
  CreateNomenclatureRequest,
  Nomenclature,
  UpdateNomenclatureRequest
} from '../../../services/admin';

@Component({
  selector: 'app-admin-nomenclatures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-nomenclatures.html',
  styleUrl: './admin-nomenclatures.css'
})
export class AdminNomenclatures implements OnInit {
  private adminService = inject(AdminService);

  nomenclatures: Nomenclature[] = [];
  filterCategory = '';
  loading = false;
  saving = false;
  error = '';
  message = '';

  createModel: CreateNomenclatureRequest = {
    category: '',
    code: '',
    label: '',
    description: '',
    sortOrder: 0,
    active: true
  };

  editNomenclatureId: string | null = null;
  editModel: UpdateNomenclatureRequest = {
    category: '',
    code: '',
    label: '',
    description: '',
    sortOrder: 0,
    active: true
  };

  ngOnInit(): void {
    this.loadNomenclatures();
  }

  loadNomenclatures(): void {
    this.loading = true;
    this.error = '';
    const category = this.filterCategory.trim();
    this.adminService.listNomenclatures(category.length > 0 ? category : undefined).subscribe({
      next: (items) => {
        this.nomenclatures = items;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err, 'Chargement des nomenclatures impossible.');
      }
    });
  }

  createNomenclature(): void {
    const category = this.createModel.category.trim().toUpperCase();
    const code = this.createModel.code.trim().toUpperCase();
    const label = this.createModel.label.trim();
    if (!category || !code || !label) {
      this.error = 'Categorie, code et libelle sont obligatoires.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    const payload: CreateNomenclatureRequest = {
      category,
      code,
      label,
      description: this.createModel.description?.trim(),
      sortOrder: Number(this.createModel.sortOrder ?? 0),
      active: this.createModel.active
    };

    this.adminService.createNomenclature(payload).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Nomenclature creee.';
        this.createModel = {
          category: '',
          code: '',
          label: '',
          description: '',
          sortOrder: 0,
          active: true
        };
        this.loadNomenclatures();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.error = this.extractErrorMessage(err, 'Creation nomenclature impossible.');
      }
    });
  }

  startEdit(item: Nomenclature): void {
    this.editNomenclatureId = item.id;
    this.editModel = {
      category: item.category,
      code: item.code,
      label: item.label,
      description: item.description ?? '',
      sortOrder: item.sortOrder,
      active: item.active
    };
    this.error = '';
    this.message = '';
  }

  cancelEdit(): void {
    this.editNomenclatureId = null;
  }

  saveEdit(): void {
    if (!this.editNomenclatureId) {
      return;
    }

    const category = this.editModel.category?.trim().toUpperCase() ?? '';
    const code = this.editModel.code?.trim().toUpperCase() ?? '';
    const label = this.editModel.label?.trim() ?? '';
    if (!category || !code || !label) {
      this.error = 'Categorie, code et libelle sont obligatoires.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    const payload: UpdateNomenclatureRequest = {
      category,
      code,
      label,
      description: this.editModel.description?.trim(),
      sortOrder: Number(this.editModel.sortOrder ?? 0),
      active: this.editModel.active
    };

    this.adminService.updateNomenclature(this.editNomenclatureId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Nomenclature modifiee.';
        this.editNomenclatureId = null;
        this.loadNomenclatures();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.error = this.extractErrorMessage(err, 'Modification nomenclature impossible.');
      }
    });
  }

  deleteNomenclature(item: Nomenclature): void {
    const confirmed = confirm(`Supprimer ${item.category} / ${item.code} ?`);
    if (!confirmed) {
      return;
    }

    this.error = '';
    this.message = '';
    this.adminService.deleteNomenclature(item.id).subscribe({
      next: () => {
        this.message = 'Nomenclature supprimee.';
        this.loadNomenclatures();
      },
      error: (err: HttpErrorResponse) => {
        this.error = this.extractErrorMessage(err, 'Suppression nomenclature impossible.');
      }
    });
  }

  trackByNomenclatureId(_: number, item: Nomenclature): string {
    return item.id;
  }

  private extractErrorMessage(err: HttpErrorResponse, fallback: string): string {
    const errorBody = err.error as { message?: string } | null;
    const backendMessage = errorBody?.message?.trim();
    return backendMessage && backendMessage.length > 0 ? backendMessage : fallback;
  }
}
