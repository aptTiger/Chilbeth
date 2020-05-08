import { ScrollToTopComponent } from './../../others/scroll-to-top/scroll-to-top.component';
import { FillableForm } from './../../../services/fillable-form';
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from 'src/services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.component.html',
  styleUrls: ['./new-blog.component.css']
})
export class NewBlogComponent implements OnInit, FillableForm {

  /* Alert flags */
  successCreatingBlog = false;
  failedCreatingBlog = false;
  disableSubmitButton = false;

  /* For regular form */
  form = new FormGroup({
    title: new FormControl("", Validators.required),
    desc: new FormControl("", Validators.required)
  });

  fileData: File = null;
  previewUrl: any = null;

  /* For AngularEditor */
  bigFormContent: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '70vh',
    minHeight: '300px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Blog content...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top'
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ]
  };

  constructor(private backend: BackendService, private router: Router) { }

  actionPending() {
    this.disableSubmitButton = true;  // Shows spinning animation on submit button
  }

  actionFailed() {
    this.failedCreatingBlog = true; // Shows failure alert
  }

  actionSuccess() {
    this.successCreatingBlog = true; // Shows success alert
    this.disableSubmitButton = false; // Disables spinning animation on submit button
    // Empties the form
    this.fileData = null;
    this.previewUrl = null;
    this.bigFormContent = '';
    this.previewUrl = '';
    this.form.get('title').setValue('');
    this.form.get('desc').setValue('');
    ScrollToTopComponent.scrollToTop(); // Scrolls page to top
  }

  resetAlert() {
    // Reset alert dialogs
    this.successCreatingBlog = false;
    this.failedCreatingBlog = false;
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show image preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  onSubmit() {
    const formData = new FormData();
    // sortingHash will be used to identify the image in the database. It's also used here as the name of the binary we're sending
    let sortingHash = this.backend.generateUniqueChronoString();
    formData.append(sortingHash, this.fileData);
    this.backend.uploadImage(this, formData);

    let formText = this.form.value;
    formText.sortingHash = sortingHash;
    formText.post = this.bigFormContent;
    this.backend.createBlog(this, formText);
  }

  ngOnInit(): void {
  }

}
