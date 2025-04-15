import { Routes } from '@angular/router';
import { HomeComponent } from './components/Home/home/home.component';
import { PostDetailsComponent } from './components/Post/post-details/post-details.component';
import { BookletComponent } from './components/booklet/booklet.component';
import { VideoComponent } from './components/video/video.component';
import { PostListComponent } from './components/Post/post-list/post-list.component';
import { BookletDetailsComponent } from './components/booklet/booklet-details/booklet-details.component';

export const routes: Routes = [
    {path:'', pathMatch:'full',component: HomeComponent},
    {path:'posts',pathMatch:'full', component:PostListComponent},
    {path:'post/:id',pathMatch:'full',component:PostDetailsComponent},
    {path:'booklets',pathMatch:'full',component:BookletComponent},
    {path:'booklets/:id',pathMatch:'full',component:BookletDetailsComponent},
    {path:'videos',pathMatch:'full',component:VideoComponent},
    {path:'videos/:id',pathMatch:'full',component:BookletComponent},
];
