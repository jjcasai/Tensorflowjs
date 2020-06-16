import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanComponent } from './features/scan/scan.component';
import { PredictionsComponent } from './features/predictions/predictions.component';


const routes: Routes = [
  { path: '', component: ScanComponent },
  { path: 'predictions', component: PredictionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
