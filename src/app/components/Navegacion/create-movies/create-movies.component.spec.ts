import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePeliculasComponent } from './create-movies.component';

describe('CreatePeliculasComponent', () => {
  let component: CreatePeliculasComponent;
  let fixture: ComponentFixture<CreatePeliculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePeliculasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePeliculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
