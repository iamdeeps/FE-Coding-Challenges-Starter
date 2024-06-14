import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { MovieDataService } from './data.service';
import { MovieComplete } from './movie.models';
import { Title } from '@angular/platform-browser';
import { Constants } from 'src/app/constants/constant';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html'
})
export class MovieComponent implements OnDestroy, OnInit {
  public movie: MovieComplete;
  public movieId = '';
  private movieSubscription: Subscription;
  private activatedRouteSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private moviedataService: MovieDataService,
    private title: Title
  ) {}

  public ngOnInit() {
    this.title.setTitle(Constants.movieDetailPage);
    this.activatedRouteSubscription = this.activatedRoute.params
      .pipe(
        tap((params: Params) => {
          const { id } = params as { id: string };
          this.movieId = id;
        })
      )
      .subscribe();
    this.movieSubscription = this.moviedataService
      .getMovie(this.movieId)
      .pipe(tap((data) => (this.movie = data)))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
    this.activatedRouteSubscription.unsubscribe();
  }
}
