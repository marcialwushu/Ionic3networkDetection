
import { NetworkInterface } from '@ionic-native/network-interface';

import { Component, Injectable } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';
import { Plugin, IonicNativePlugin, Cordova } from '@ionic-native/core';

//declare var WifiWizard: any;


@Plugin({
  pluginName: 'WifiWizard',
  plugin: 'wifiwizard',
  pluginRef: 'WifiWizard',
  repo: 'https://github.com/hoerresb/WifiWizard',
  platforms: ['Android', 'iOS']
})
@Injectable()

export class WifiWizard extends IonicNativePlugin {
  @Cordova()
  getCurrentSSID(): Promise<string> {return;}
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  connected: Subscription;
  disconnected: Subscription;
  ipadress: any;
  
  constructor(
    private toast: ToastController, 
    private network: Network, 
    public navCtrl: NavController,
    private networkInterface: NetworkInterface,
    public wifiWizard: WifiWizard
  ) { }

  
 
  
  ionViewDidEnter(){
   this.connected = this.network.onConnect().subscribe(data => {
     console.log(data)
     this.displayNetworkUpdate(data.type);
   }, error => console.log(error));

   this.disconnected = this.network.onDisconnect().subscribe(data => {
     console.log(data)
     this.displayNetworkUpdate(data.type);
   }, error => console.log(error));
  }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
     
    }).present();
   
  }

  ionViewWillLeave(){
   this.connected.unsubscribe();
   this.disconnected.unsubscribe();
  }

  getIpAdress(){
    
    this.networkInterface.getWiFiIPAddress().catch(data =>{
      console.log(data);
      this.ipadress = data;
      this.displayIpAdress(data);
      
    })
  }

  displayIpAdress(ipConnection: string){
    let adressIp = this.ipadress;
    this.toast.create({
      message: `You are now ${ipConnection} via ${adressIp}`,
      duration: 3000
    }).present();
  }

  errorHandler(err: any){
    alert(`Problem: ${err}`);
  }

  getSsidName(){
    this.wifiWizard.getCurrentSSID()
      .then(ssid => ssid = ssid)
      .catch(error => console.log(error));
  }
  /*
  listNetworks(){
    WifiWizard.listNetworks(networks => alert(`Networks: ${networks}`), this.errorHandler);
  }

  */

}
