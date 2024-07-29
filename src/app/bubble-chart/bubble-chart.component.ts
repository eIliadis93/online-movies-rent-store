import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Movie, MovieCount } from '../interface/movie';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
})
export class BubbleChartComponent implements OnInit, OnDestroy {
  chartOptions: any = {};
  private chart: any;
  private dataSubscription: Subscription = new Subscription();

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.fetchMovieData();
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private fetchMovieData(): void {
    this.dataSubscription.add(
      this.movieService.getMoviesAll().subscribe(
        (movies) => {
          console.log('Fetched movies:', movies); 
          const movieCounts = this.processData(movies);
          console.log('Processed movie counts:', movieCounts);
          this.chartOptions = {
            theme: 'dark2',
            animationEnabled: true,
            title: {
              text: 'Movies per Publication Year',
            },
            axisX: {
              title: 'Publication Year',
            },
            axisY: {
              title: 'Number of Movies',
              includeZero: true,
            },
            data: [
              {
                type: 'bubble',
                zValueFormatString: '##.##',
                showInLegend: true,
                legendText: 'Size of Bubble Represents Number of Movies',
                legendMarkerType: 'circle',
                legendMarkerColor: 'grey',
                toolTipContent:
                  "<b><span style='color: {color};'>{name}</span></b><br/>Year: {x}<br/> Number of Movies: {y}<br/> Size: {z}",
                dataPoints: movieCounts,
              },
            ],
          };
          this.renderChart();
        },
        (error) => console.error('Error fetching movies:', error)
      )
    );
  }

  private processData(movies: Movie[]): any[] {
    const movieCounts: MovieCount = {};
  
    movies.forEach((movie: Movie) => {
      const year = movie.pub_date;
      if (year && year >= 1900 && year <= new Date().getFullYear()) {
        if (movieCounts[year]) {
          movieCounts[year]++;
        } else {
          movieCounts[year] = 1;
        }
      } else {
        console.warn('Movie with invalid or missing pub_date:', movie);
      }
    });
  
    const years = Object.keys(movieCounts).map(yearStr => parseInt(yearStr, 10));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
  
    const currentYear = new Date().getFullYear();
    const validMinYear = Math.max(minYear, 1800);
    const validMaxYear = Math.min(maxYear, currentYear);
  
    const allYears: MovieCount = {};
    for (let year = validMinYear; year <= validMaxYear; year++) {
      allYears[year] = movieCounts[year] || 0;
    }
  
    return Object.keys(allYears).map(yearStr => {
      const year = parseInt(yearStr, 10);
      return {
        x: year,
        y: allYears[year],
        z: allYears[year],
        name: `Movies in ${year}`,
      };
    });
  }
  

  private renderChart(): void {
    const CanvasJS = (window as any)['CanvasJS'];
    if (CanvasJS && this.chartOptions.data[0] && this.chartOptions.data[0].dataPoints.length > 0) {
      const minYear = Math.min(...this.chartOptions.data[0].dataPoints.map((dp: { x: any; }) => dp.x));
      const maxYear = Math.max(...this.chartOptions.data[0].dataPoints.map((dp: { x: any; }) => dp.x));
  
      this.chart = new CanvasJS.Chart('chartContainer', {
        ...this.chartOptions,
        axisX: {
          ...this.chartOptions.axisX,
          minimum: minYear,
          maximum: maxYear,
        },
      });
      this.chart.render();
    } else {
      console.error('CanvasJS is not loaded or dataPoints are empty.');
    }
  }
  
}
