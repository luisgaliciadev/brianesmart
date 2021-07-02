import { Component, OnInit } from '@angular/core';
import { Video } from '../../models/youtube.models';
import Swal from 'sweetalert2'
import { YoutubeService } from 'src/app/services/service.index';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videos-instructivos',
  templateUrl: './videos-instructivos.component.html',
  styleUrls: ['./videos-instructivos.component.css']
})
export class VideosInstructivosComponent implements OnInit {

  videos: Video[] = [];
  buscar = '';
  constructor(
    private _youtubeService: YoutubeService,
    public _userService: UserService,
    public _router: Router
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.cargarVideos();
  }

  cargarVideos() {
    this._youtubeService.getVideos().subscribe(
      (response) => {
        this.videos.push(...response);
        // console.log(this.videos);
      }
    );
  }

  mostrarVideo(video: Video) {
    console.log(video);
    Swal.fire({
      html:`
        <h4>${video.title}</h4>
        <iframe 
          width="100%" height="315" 
          src="https://www.youtube.com/embed/${video.resourceId.videoId}" 
          title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `,
      confirmButtonText:'Cerrar',
    })
  }

}


