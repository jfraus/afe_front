import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { RoleAction } from 'src/app/models/roleAction.model';
import { PermissionsController } from 'src/app/services/permissions-controller.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-admin-permisions',
  templateUrl: './admin-permisions.component.html',
  providers: [PermissionsController]
})
export class AdminPermisionsComponent implements OnInit {

  loading: boolean = true;
  nodesRoleAction: TreeNode[] = [];
  selectedNodes1: TreeNode[] = [];
  selectedNodes: TreeNode[] = [];
  selected: any[] = [];
  cols: any[];
  roleId: number;

  constructor(private permissionsService: PermissionsController,
    private router: ActivatedRoute,
    private messageServices: MessageService,
    private location: Location) { }

  ngOnInit() {
    this.loading = true;
    this.router.params.subscribe(data => {
      this.roleId = data['id'];
    });

    if(!isNullOrUndefined(this.roleId)) {
      this.loadPermisionsByRole();
    }
    this.cols = [
        { field: 'view', header: 'View' }
    ];
  }

  loadPermisionsByRole() {
    this.permissionsService.getFilesystem().subscribe(response => {
      this.nodesRoleAction = response;
      this.permissionsService.getActionsByRole(this.roleId).subscribe(data => {
        this.selectedNodes1 = data;
        this.selectedNodes1.forEach(item1 => {
          item1.children.forEach(item2 => {
            this.selected.push({view: item2.data.view, viewActionId: item2.data.viewActionId, viewId: item2.data.viewId});
          });
        });        
        this.checkNode(this.nodesRoleAction);
        this.loading = false;
      });
    });
  }

  checkNode(nodes:TreeNode[]) {
    for(let i=0 ; i < nodes.length ; i++) {
      if(nodes[i].children) {
        for(let j=0; j < nodes[i].children.length; j++) {
          const result = this.selected.filter(data => data.view === nodes[i].children[j].data.view && 
            data.viewActionId === nodes[i].children[j].data.viewActionId &&
            data.viewId === nodes[i].children[j].data.viewId);
            if(result.length > 0) {             
              nodes[i].children[j].partialSelected = true;
              nodes[i].partialSelected = true;
              this.selectedNodes.push(nodes[i].children[j]);
            }            
        }
      }
    }
  }

  nodeSelect(event) {
    const roleAction: RoleAction = {
    viewActionId: event.node.data.viewActionId,
    viewId: event.node.data.viewId,
    roleId: Number(this.roleId),
    }
    
    this.permissionsService.postSaveActionsByRole(roleAction).subscribe(data => {
      this.messageServices.add({ key: 'error', severity: 'success', summary: 'Se ha agregado la acción exitosamente' });   
    });
     
  }

  nodeUnselect(event) {
    const roleAction: RoleAction = {
      viewActionId: event.node.data.viewActionId,
      viewId: event.node.data.viewId,
      roleId: Number(this.roleId),
    }
    
    this.permissionsService.deleteSaveActionsByRole(event.node.data.viewId, Number(this.roleId), event.node.data.viewActionId).subscribe(data => {
      this.messageServices.add({ key: 'error', severity: 'success', summary: 'Se ha eliminado la acción exitosamente' });   
    });
  }

  locationBack() {
    this.location.back();
  }
}
