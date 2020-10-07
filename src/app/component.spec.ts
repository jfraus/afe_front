import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './component';
import { AppMainComponent } from './main.component';
import { AppMenuComponent, AppSubMenuComponent } from './template/menu/menu.component';
import { AppTopBarComponent } from './template/topbar/topbar.component';
import { AppConfigComponent } from './config.component';
import { AppFooterComponent } from './template/footer/footer.component';
import { AppBreadcrumbComponent } from './template/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './template/breadcrumb/breadcrumb.service';
import { TabViewModule } from 'primeng/tabview';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          NoopAnimationsModule, RouterTestingModule, TabViewModule
      ],
      declarations: [
          AppComponent,
          AppMainComponent,
          AppMenuComponent,
          AppSubMenuComponent,
          AppTopBarComponent,
          AppConfigComponent,
          AppFooterComponent,
          AppBreadcrumbComponent
      ],
      providers: [BreadcrumbService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
