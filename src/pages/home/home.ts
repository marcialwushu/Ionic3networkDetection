
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { NetworkInterface } from '@ionic-native/network-interface';
import { BLE } from '@ionic-native/ble';

import { Component, Injectable } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  connected: Subscription;
  disconnected: Subscription;
  ipadress: any;
  scanNetworks: any;
  devices: any[];
  isScanning = false;
  
  constructor(
    private toast: ToastController, 
    private network: Network, 
    public navCtrl: NavController,
    private networkInterface: NetworkInterface,
    private hotspot: Hotspot,
    private ble: BLE
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
      this.displayIpAdress(data.type);
      
    })
  }

  displayIpAdress(ipConnection: string){
    let adressIp = this.networkInterface.getWiFiIPAddress.name;
    this.toast.create({
      message: `You are now ${ipConnection} via ${adressIp}`,
      duration: 3000
    }).present();
  }

  
  getHotspot(){
    this.hotspot.scanWifi().then((networks: Array<HotspotNetwork>) => {
      console.log(networks);
      this.scanNetworks = networks;
     this.displayHotSpot(this.scanNetworks.type);
      
    })
  }

  
  displayHotSpot(hotspotConnection: string){
    let hotspotAdress = this.scanNetworks;
    this.toast.create({
      message: `You are now ${hotspotConnection} via ${hotspotAdress}`,
      duration: 3000
    }).present();
  }

  startScanning(){
    console.log("Scanning ..");
    this.devices=[];
    this.isScanning=true;
    this.ble.startScan([]).subscribe(
      device => {
        this.devices.push(device);
      }
    )
  }

  setTimeout(){
    this.ble.stopScan().then(() => {
      console.log("Scanning has stopped");
      console.log(JSON.stringify(this.devices))
      this.isScanning  = false;
    }),5000;
  }

  

}
