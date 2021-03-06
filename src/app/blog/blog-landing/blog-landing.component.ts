import { BackendService } from 'src/services/backend.service';
import { Component, OnInit } from '@angular/core';
import { ApiEndpoints } from 'src/services/api-endpoints';

@Component({
  selector: 'app-blog-landing',
  templateUrl: './blog-landing.component.html',
  styleUrls: ['./blog-landing.component.css']
})
export class BlogLandingComponent implements OnInit {

  backendUrl = ApiEndpoints.BLOG;
  blogs: any;

  constructor(public backend: BackendService) { }

  // Will be called by PaginationComponent, when this component's model is ready
  receivePageContent(data: any) {
    this.blogs = data;
  }

  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }

  ngOnInit(): void {

  }

}
