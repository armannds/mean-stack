import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private BASE_URL = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http
      .get<{ message: string; post: any }>(this.BASE_URL + '/' + id)
      .pipe(
        map((response) => {
          return {
            id: response.post._id,
            title: response.post.title,
            content: response.post.content,
            imagePath: response.post.imagePath,
            creator: response.post.creator,
          };
        })
      );
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.BASE_URL + queryParams
      )
      .pipe(
        map((response) => {
          return {
            posts: response.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: response.maxPosts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next({
          posts: this.copyOfPosts(),
          postCount: postData.maxPosts,
        });
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(this.BASE_URL, postData)
      .subscribe((response) => this.router.navigate(['/']));
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http
      .put(this.BASE_URL + '/' + id, postData)
      .subscribe((response) => this.router.navigate(['/']));
  }

  deletePost(id: string) {
    return this.http.delete(this.BASE_URL + '/' + id);
  }

  private copyOfPosts() {
    return [...this.posts];
  }
}
