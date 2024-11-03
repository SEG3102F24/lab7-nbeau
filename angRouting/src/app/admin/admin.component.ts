import {Component, inject} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Author, Book} from '../books/model/book';
import {BooksService} from '../books/service/books.service';
import { NgFor } from '@angular/common';

function categoryValidator(control: FormControl<string>): { [s: string]: boolean } | null {
  const validCategories = ['Kids', 'Tech', 'Cook'];
  if (!validCategories.includes(control.value)) {
    return {invalidCategory: true};
  }
  return null;
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor]
})
export class AdminComponent {
  private builder: FormBuilder = inject(FormBuilder);
  private booksService: BooksService = inject(BooksService);
  bookForm = this.builder.group({
    id: ['', [Validators.required, Validators.pattern('[1-9]\\d{3}')]],
    category: ['', [Validators.required, categoryValidator]],
    title: ['', Validators.required],
    cost: ['', [Validators.required, Validators.pattern('\\d+(\\.\\d{1,2})?')] ],
    authors: this.builder.array([]),
    year: [''],
    description: ['']
  });

  get id(): AbstractControl<string> {return <AbstractControl>this.bookForm.get('id'); }
  get category(): AbstractControl<string> {return <AbstractControl>this.bookForm.get('category'); }
  get title(): AbstractControl<string> {return <AbstractControl>this.bookForm.get('title'); }
  get cost(): AbstractControl<string> {return <AbstractControl>this.bookForm.get('cost'); }
  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  onSubmit(): void {
    const book = new Book(0,
      this.bookForm.value.category!,
      this.bookForm.value.title!,
      Number(this.bookForm.value.cost),
      [],
      Number(this.bookForm.value.year),
      this.bookForm.value.description!);
    const authors: Author[] = this.bookForm.value.authors as Author[];
    this.booksService.addBook(book).subscribe(
      (response) => {
        authors.forEach(
          (author: Author) => {
            this.booksService.getAuthorsNamed(author.firstName, author.lastName).subscribe(
              (authorList: Author[]) => {
                if (authorList === undefined || authorList.length === 0) {
                  this.booksService.addBookAuthor(response.id, author).subscribe();
                } else {
                  this.booksService.updateBookAuthors(response.id, authorList[0].id).subscribe();
                }
              }
            );
          }
        );
      }
    );
    this.bookForm.reset();
    this.authors.clear();
  }

  addAuthor(): void {
    this.authors.push(
      this.builder.group({
        firstName: [''],
        lastName: ['']
      })
    );
  }

  removeAuthor(i: number): void {
    this.authors.removeAt(i);
  }
}

