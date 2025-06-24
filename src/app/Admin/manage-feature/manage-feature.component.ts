import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostsService } from '../../services/posts.service';
import { BookletsService } from '../../services/booklets.service';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from '../../model/Post';
import { Booklet } from '../../model/Booklet';
import { ContentSummary } from '../../model/ContentSummary';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdminstatsService } from '../../services/adminstats.service';

@Component({
  selector: 'app-manage-feature',
  imports: [MatSnackBarModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage-feature.component.html',
  styleUrl: './manage-feature.component.css',
})
export class ManageFeatureComponent implements OnInit {
  contentType: string = 'Post';
  selectedContentId: number | null = null;
  isSubmitting = false;
  list: MatTableDataSource<ContentSummary> =
    new MatTableDataSource<ContentSummary>([]);
  allItems: ContentSummary[] = [];
  selectedItem: ContentSummary | null = null;

  constructor(
    private snackbar: MatSnackBar,
    private postService: PostsService,
    private bookletService: BookletsService,
    private santizer: DomSanitizer,
    private adminsService: AdminstatsService
  ) {}

  ngOnInit(): void {
    this.loadContentOptions(this.contentType);
  }
  onContentTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const type = selectElement.value;
      this.contentType = type;
      this.selectedContentId = null;
      this.loadContentOptions(this.contentType);
    }
  }

  onContentSelect(): void {
    this.selectedItem =
      this.allItems.find((item) => item.id == this.selectedContentId) || null;  }

  loadContentOptions(contentType: string) {
    if (contentType === 'Post') {
      this.postService.getPosts().subscribe({
        next: (posts: Post[]) => {
          this.allItems = posts.map((post) => ({
            id: post.postId,
            title: post.postTitle,
            description: post.postContent,
            thumbnail: post.thumbnail,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            createdAt: post.createdAt,
            ContentType: contentType,
          }));
          this.list.data = this.allItems;
          console.log(this.list);
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else if (contentType === 'Booklet') {
      this.bookletService.getBooklets().subscribe({
        next: (booklets: Booklet[]) => {
          this.allItems = booklets.map((booklet) => ({
            id: booklet.bookletId,
            title: booklet.bookletTitle,
            description: booklet.bookletDescription,
            thumbnail: booklet.thumbnail,
            likeCount: booklet.likeCount,
            commentCount: booklet.commentCount,
            createdAt: booklet.createdAt,
            ContentType: contentType,
          }));
          this.list.data = this.allItems;
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  sanitize(html: string): SafeHtml {
    return this.santizer.bypassSecurityTrustHtml(html);
  }

  onSubmit(): void {

    if (this.selectedItem && this.selectedContentId) {
      this.adminsService
        .selectFeature(this.selectedItem.ContentType, this.selectedContentId)
        .subscribe({
          next: (data) => {
            this.snackbar.open('Feature Content Selected', 'close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackbar.open(`Error ${error}`, 'close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
            });
            console.error(error);
          },
        });
    }
  }
}
