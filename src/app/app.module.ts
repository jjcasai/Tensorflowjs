import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ScanComponent } from './features/scan/scan.component';
import { CardComponent } from './shared/components/card/card.component';
import { ProductNamePipe } from './shared/pipes/product-name.pipe';
import { PredictionsComponent } from './features/predictions/predictions.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    NavbarComponent,
    FooterComponent,
    ScanComponent,
    CardComponent,
    ProductNamePipe,
    PredictionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
