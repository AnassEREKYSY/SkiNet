import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="mt-24 border-t border-line bg-snow">
      <div class="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="/images/logo-mark.svg" alt="" class="h-8 w-8" />
            <span class="text-lg font-bold tracking-tight text-navy">Skinet</span>
          </a>
          <p class="max-w-xs text-sm muted">Snow sports gear for every level, from first turns to fresh powder.</p>
        </div>
        <div>
          <p class="mb-3 text-sm font-semibold text-navy">Shop</p>
          <ul class="space-y-2 text-sm muted">
            <li><a routerLink="/shop" [queryParams]="{ type: 'Boards' }" class="hover:text-navy">Boards</a></li>
            <li><a routerLink="/shop" [queryParams]="{ type: 'Boots' }" class="hover:text-navy">Boots</a></li>
            <li><a routerLink="/shop" [queryParams]="{ type: 'Gloves' }" class="hover:text-navy">Gloves</a></li>
            <li><a routerLink="/shop" [queryParams]="{ type: 'Hats' }" class="hover:text-navy">Hats</a></li>
          </ul>
        </div>
        <div>
          <p class="mb-3 text-sm font-semibold text-navy">Account</p>
          <ul class="space-y-2 text-sm muted">
            <li><a routerLink="/account/login" class="hover:text-navy">Sign in</a></li>
            <li><a routerLink="/orders" class="hover:text-navy">My orders</a></li>
            <li><a routerLink="/cart" class="hover:text-navy">Cart</a></li>
          </ul>
        </div>
        <div>
          <p class="mb-3 text-sm font-semibold text-navy">Good to know</p>
          <ul class="space-y-2 text-sm muted">
            <li class="flex items-center gap-2"><span class="material-icons-outlined text-base">lock</span>Secure payment with Stripe</li>
            <li class="flex items-center gap-2"><span class="material-icons-outlined text-base">local_shipping</span>Tracked delivery</li>
            <li><a routerLink="/test-error" class="hover:text-navy">Error handling demo</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-line">
        <div class="container flex flex-col justify-between gap-2 py-5 text-xs muted sm:flex-row">
          <p>© {{ year }} Skinet. Demo store, payments run in Stripe test mode.</p>
          <p>Built with .NET 8 and Angular 18</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
