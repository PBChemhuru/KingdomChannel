import { Routes } from '@angular/router';
import { HomeComponent } from './components/Home/home/home.component';
import { PostDetailsComponent } from './components/Post/post-details/post-details.component';
import { BookletComponent } from './components/booklet/booklet.component';
import { VideoComponent } from './components/video/video.component';
import { PostListComponent } from './components/Post/post-list/post-list.component';
import { BookletDetailsComponent } from './components/booklet/booklet-details/booklet-details.component';
import { AboutComponent } from './components/about/about.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { ManagePostsComponent } from './Admin/manage-posts/manage-posts.component';
import { ManageVideosComponent } from './Admin/manage-videos/manage-videos.component';
import { ManageBookletsComponent } from './Admin/manage-booklets/manage-booklets.component';
import { FlaggedCommentsComponent } from './Admin/flagged-comments/flagged-comments.component';
import { adminGuard } from './guards/admin.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdminstatsComponent } from './Admin/adminstats/adminstats.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'posts', pathMatch: 'full', component: PostListComponent },
      { path: 'post/:id', pathMatch: 'full', component: PostDetailsComponent },
      { path: 'booklets', pathMatch: 'full', component: BookletComponent },
      {
        path: 'booklets/:id',
        pathMatch: 'full',
        component: BookletDetailsComponent,
      },
      { path: 'videos', pathMatch: 'full', component: VideoComponent },
      { path: 'about', pathMatch: 'full', component: AboutComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [
      { path: '', component:AdminstatsComponent },
      { path: 'posts', component: ManagePostsComponent },
      { path: 'videos', component: ManageVideosComponent },
      { path: 'booklets', component: ManageBookletsComponent },
      { path: 'flagged-comments', component: FlaggedCommentsComponent },
    ],
  },
];
