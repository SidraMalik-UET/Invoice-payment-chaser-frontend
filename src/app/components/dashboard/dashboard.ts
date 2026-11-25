
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { WorkspaceService, Workspace } from '../../services/workspace.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(
    public authService: AuthService,
    public workspaceService: WorkspaceService
  ) {}

  ngOnInit() {

    console.log('Dashboard loaded');

    console.log('Current User:', this.authService.currentUser());

    this.workspaceService.getWorkspaces().subscribe({
      next: (response) => {
        console.log('Workspaces loaded:', response.data.workspaces);
      },
      error: (error) => {
        console.error('Failed to load workspaces:', error);
      }
    });

  }

  // Switch active workspace
  switchWorkspace(workspace: Workspace): void {

    this.workspaceService.switchWorkspace(workspace);

    console.log('Active Workspace:', workspace.name);

  }

}
