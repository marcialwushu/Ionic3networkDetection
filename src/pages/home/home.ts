import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private toast: ToastController, private network: Network, public navCtrl: NavController) {

  }


  ionViewDidEnter(){
   this.network.onConnect().subscribe(data => {
     console.log(data)
   }, error => console.log(error));

   this.network.onDisconnect().subscribe(data => {
     console.log(data)
   }, error => console.log(error));
  }

}
