import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../books/service/books.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf]
})
export class AuthorsComponent {
  authorForm: FormGroup;
  authorData: any | null = null;
  message: string = '';

  constructor(private fb: FormBuilder, private booksService: BooksService) {
    this.authorForm = this.fb.group({
      authorId: ['']
    });
  }

  onSubmit(): void {
    const authorId = this.authorForm.get('authorId')?.value;
    if (authorId) {
      this.booksService.getAuthorById(authorId).subscribe({
        next: (data) => {
          this.authorData = data;
          this.message = '';
        },
        error: () => {
          this.authorData = null;
          this.message = 'Author not found.';
        }
      });
    }
  }
}
