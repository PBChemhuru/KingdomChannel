import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {

  constructor() { }
  shareOnFacebook(url: string): void {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnWhatsApp(url: string): void {
    const message = `Check this out: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  }

  shareOnTwitter(url: string, text: string = ''): void {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  }

  shareOnLinkedIn(url: string): void {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  }

  copyLinkToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}
