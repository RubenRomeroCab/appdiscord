import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfileComponent } from './perfile.component';

describe('PerfileComponent', () => {
  let component: PerfileComponent;
  let fixture: ComponentFixture<PerfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
