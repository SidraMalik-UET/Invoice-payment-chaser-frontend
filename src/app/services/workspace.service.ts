
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  role: string;
}

interface WorkspaceResponse {
  success: boolean;
  data: {
    user: any;
    workspaces: Workspace[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/auth/me';

  // Store all workspaces
  workspaces = signal<Workspace[]>([]);

  // Store selected workspace
  activeWorkspace = signal<Workspace | null>(null);

  constructor(private http: HttpClient) {}

  // Get user's workspaces
  getWorkspaces(): Observable<WorkspaceResponse> {

    return this.http.get<WorkspaceResponse>(this.apiUrl).pipe(

      tap(response => {

        const workspaceList = response.data.workspaces;

        this.workspaces.set(workspaceList);

        const savedId = localStorage.getItem('activeWorkspaceId');

        const selectedWorkspace = workspaceList.find(
          workspace => workspace.id === Number(savedId)
        );

        const workspaceToSelect =
          selectedWorkspace || workspaceList[0] || null;

        this.activeWorkspace.set(workspaceToSelect);

        if (workspaceToSelect) {
          localStorage.setItem(
            'activeWorkspaceId',
            String(workspaceToSelect.id)
          );
        } else {
          localStorage.removeItem('activeWorkspaceId');
        }

      })

    );
  }

  // Switch active workspace
  switchWorkspace(workspace: Workspace): void {

    this.activeWorkspace.set(workspace);

    localStorage.setItem(
      'activeWorkspaceId',
      String(workspace.id)
    );
  }

}
