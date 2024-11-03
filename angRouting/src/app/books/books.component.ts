import {Component, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css'],
    standalone: true,
    imports: [RouterOutlet]
})
export class BooksComponent {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  submit(value: string): void {
    this.router.navigate(['./', value], {relativeTo: this.route}).then(() => {});
  }
}
