import { Routes } from '@angular/router';
import { HomeComponent } from './components/Home/home/home.component';
import { PostsComponent } from './components/Post/posts/posts.component';
import { PostDetailsComponent } from './components/Post/post-details/post-details.component';

export const routes: Routes = [
    {path:'', pathMatch:'full',component: HomeComponent},
    {path:'posts',pathMatch:'full', component:PostsComponent},
    {path:'post/:id',pathMatch:'full',component:PostDetailsComponent}
];
