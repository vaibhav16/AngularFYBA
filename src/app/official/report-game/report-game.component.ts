import { Component, ElementRef,Renderer2,ViewChild } from '@angular/core';
import { NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { OfficialService } from '../official.service';

@Component({
  selector: 'app-report-game',
  templateUrl: './report-game.component.html',
  styles: [`.incidentimg {
    float: left,
    width: 100px,
    margin-left: 20px,
    height: 100px,
    background: #999999,
    text-align: center,
    line-height: 100px,
    color: #ffffff,
    position: relative,
    border: 3px solid #3c98db;

  }`]
})
export class ReportGameComponent {
  @ViewChild("acchead1", {read: ElementRef}) 
  private acchead1: ElementRef; 
  @ViewChild("Incidentlist", {read: ElementRef}) 
  private Incidentlist: ElementRef;
  
  incidentcounter:number;
  IncidentImage;
  showIncident:boolean;
  
  playername = ['Bobby Brady', 'Greg Brady', 'Mike Brady'];
  constructor( private elementRef: ElementRef,private renderer:Renderer2, config: NgbAccordionConfig, public officialService: OfficialService) { 
    
  }

  ngOnInit() {
    this.incidentcounter=0;
    this.showIncident=false;
   
  }
   

  beforeChange(event: any) {
    let el=this.acchead1.nativeElement.firstChild;
    if(event.nextState==true){
      this.renderer.removeClass(el,'glyphicon-triangle-right');
      this.renderer.addClass(el,'glyphicon-triangle-bottom');
    }else{
      this.renderer.removeClass(el,'glyphicon-triangle-bottom');
      this.renderer.addClass(el,'glyphicon-triangle-right');
    }
  
  }
  
  onFileChanged(event:any,ImageName:string) {
    var file = event.target.files[0];
    var closesrc="assets/images/cancel_icon.png";
    var ImageName = 'Incident_';
    var ext, fname;
    fname = file.name.split('.');
    ext = fname[1];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.showIncident = true;
      this.IncidentImage = event.target.result;
      let li=this.renderer.createElement('li');
      let img=this.renderer.createElement('img');
      this.renderer.setProperty(img, 'src', this.IncidentImage);
      this.renderer.setProperty(img, 'name', ImageName+this.incidentcounter);

      let closeicon=this.renderer.createElement('img');
      this.renderer.setProperty(closeicon, 'src', closesrc);
  
      this.renderer.appendChild(li, img);
      this.renderer.appendChild(li, closeicon);
      this.renderer.insertBefore(this.Incidentlist.nativeElement,li,this.renderer.selectRootElement('.Incidentclass'));
    }
      this.incidentcounter=this.incidentcounter+1;
   
  }

}
