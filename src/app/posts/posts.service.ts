import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}


  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.BASE_URL)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
            };
          });
        })
      )
      .subscribe(posts => {
        this.posts = posts;
        this.postsUpdated.next(this.copyOfPosts());
      });
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content,
    };
    this.http
      .post<{ message: string, postId: string }>(this.BASE_URL, post)
      .subscribe(responseData => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next(this.copyOfPosts());
      });
  }

  deletePost(id: string) {
    this.http.delete(this.BASE_URL + '/' + id)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.postsUpdated.next(this.copyOfPosts());
    });
  }

  private copyOfPosts() {
    return [...this.posts];
  }
}
