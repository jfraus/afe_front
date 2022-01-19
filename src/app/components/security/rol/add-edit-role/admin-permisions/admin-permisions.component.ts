import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { PermissionsController } from 'src/app/services/permissions-controller.service';

@Component({
  selector: 'app-admin-permisions',
  templateUrl: './admin-permisions.component.html',
  providers: [PermissionsController]
})
export class AdminPermisionsComponent implements OnInit {

  loading: boolean = true;
  selectedNodes3: TreeNode[] = [];
  selectedNodes1: TreeNode[] = [];
  selectedNodes: TreeNode[] = [];
  bandera: Boolean = true;
  cols: any[];

  constructor(private permissionsService: PermissionsController,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.loading = true;
    this.permissionsService.getFilesystem().subscribe(response => {
      this.selectedNodes3 = response;
      this.router.params.subscribe(data => {
        this.permissionsService.getActionsByRole(data['id']).subscribe(data => {
          this.selectedNodes1 = data;
          /*console.log(this.selectedNodes1[1].children[1]);
          console.log(this.selectedNodes3[1].children[1].data.view);
          console.log(this.selectedNodes3[1].children[1].data.viewActionId);
          console.log(this.selectedNodes3[1].children[1].data.viewId);*/
          if(this.selectedNodes3[1].children[1].data.view &&
          this.selectedNodes3[1].children[1].data.viewActionId &&
          this.selectedNodes3[1].children[1].data.viewId) {
            console.log(this.selectedNodes3[1].children.includes(this.selectedNodes1[1].children[1]));
            this.selectedNodes.push(this.selectedNodes3[1].children[1]);
            this.selectedNodes.push(this.selectedNodes3[1]);
            this.selectedNodes[1].children[1].partialSelected = true;
            this.selectedNodes[1].partialSelected = true;
          }
          this.loading = false;
        });
      });
    });
      this.cols = [
          { field: 'view', header: 'View' }
      ];
  }

  checkNode(nodes:TreeNode[], nodes1: TreeNode[]) {
    for(let i=0 ; i < nodes.length ; i++) {
      if(nodes[i].children) {
        for(let j=0; j < nodes[i].children.length; j++) {
          nodes[i].children[j].partialSelected = true;
          console.log(nodes[i].children[j].parent);
          this.selectedNodes.push(nodes[i][j]);
        }
        nodes[i].partialSelected = true;
      }
    }
  }

  nodeSelect(event) {

    console.log(event.node, ' : ', event.node.data.viewActionId);
    
  }

  nodeUnselect(event) {
    console.log('unselect');
    
  }
}
