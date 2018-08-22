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
  private postsUpdated = new Subject<Post[]>();
  private BASE_URL = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http
      .get<{ message: string; post: any }>(this.BASE_URL + '/' + id)
      .pipe(
        map(response => {
          return {
            id: response.post._id,
            title: response.post.title,
            content: response.post.content,
          };
        })
      );
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.BASE_URL)
      .pipe(
        map(response => {
          return response.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe(posts => {
        this.posts = posts;
        this.postsUpdated.next(this.copyOfPosts());
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(this.BASE_URL, postData)
      .subscribe(response => {
        const post: Post = {
          id: response.post.id,
          title: title,
          content: content,
          imagePath: response.post.imagePath,
        };
        post.id = response.post.id;
        this.posts.push(post);
        this.postsUpdated.next(this.copyOfPosts());
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: null,
    };
    this.http.put(this.BASE_URL + '/' + id, post).subscribe(response => {
      const updatedPosts = this.copyOfPosts();
      const updatedPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[updatedPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next(this.copyOfPosts());
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    this.http.delete(this.BASE_URL + '/' + id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.postsUpdated.next(this.copyOfPosts());
    });
  }

  private copyOfPosts() {
    return [...this.posts];
  }
}
