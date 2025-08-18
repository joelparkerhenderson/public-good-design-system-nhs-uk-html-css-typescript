# Notification Banner Component

The Notification Banner component displays important system messages, announcements, or status updates at the top of a page or section. It provides a consistent way to communicate with users about system states, form validations, or important information that requires immediate attention.

## Features

- **Multiple types**: Support for default, success, warning, error, and info notifications
- **Dismissible**: Optional close button for user-dismissible notifications  
- **Auto-dismiss**: Configurable automatic dismissal with pause on hover/focus
- **Persistent dismissal**: Remember dismissed banners using localStorage
- **Accessibility**: Full ARIA support with appropriate roles for different types
- **Auto-focus**: Optional automatic focus for screen reader announcements
- **Flexible content**: Support for both plain text and rich HTML content
- **Animation**: Smooth entrance and exit animations

## Usage

### Basic Notification

```typescript
import { createNotificationBanner } from './notification-banner';

const banner = createNotificationBanner({
  text: 'Your settings have been saved successfully.',
  type: 'success',
  dismissible: true
});

document.body.appendChild(banner);
```

### Notification with HTML Content

```typescript
const banner = createNotificationBanner({
  html: 'Please <a href="/verify">verify your email address</a> to continue.',
  type: 'warning',
  titleText: 'Email Verification Required',
  dismissible: true
});
```

### Auto-dismiss Notification

```typescript
import { NotificationBanner } from './notification-banner';

const banner = createNotificationBanner({
  text: 'File upload completed.',
  type: 'success',
  dismissible: true
});

document.body.appendChild(banner);

const instance = new NotificationBanner(banner, {
  autoDismissDelay: 5000 // Auto-dismiss after 5 seconds
});
```

### Programmatic Banner Management

```typescript
import { NotificationBanner } from './notification-banner';

const bannerElement = createNotificationBanner({
  text: 'Initial message',
  titleText: 'System Status',
  type: 'info',
  dismissible: true
});

const instance = new NotificationBanner(bannerElement);

// Update content
instance.updateContent('Updated message text');
instance.updateHtml('<strong>Important:</strong> System maintenance in progress');

// Change type
instance.setType('warning');

// Update title
instance.updateTitle('Maintenance Notice');

// Show/hide programmatically
instance.hide();
instance.show();

// Dismiss with animation
instance.dismiss();

// Focus for screen reader announcement
instance.focus();
```

## Configuration Options

### NotificationBannerOptions

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `text` | `string` | Plain text content for the notification | Yes (or html) |
| `html` | `string` | HTML content for the notification (overrides text) | Yes (or text) |
| `type` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | Visual and semantic type | No (default: 'default') |
| `dismissible` | `boolean` | Whether to show close button | No (default: false) |
| `autoFocus` | `boolean` | Whether to auto-focus on initialization | No (default: false) |
| `role` | `'banner' \| 'region' \| 'alert' \| 'status'` | ARIA role override | No |
| `titleText` | `string` | Title/heading text for the notification | No |
| `titleId` | `string` | Custom ID for the title element | No |
| `classes` | `string` | Additional CSS classes | No |
| `attributes` | `Record<string, string>` | Additional HTML attributes | No |

### NotificationBannerConfig

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `autoDismissDelay` | `number` | Milliseconds before auto-dismiss (0 = no auto-dismiss) | 0 |
| `persistDismissal` | `boolean` | Remember dismissal in localStorage | false |
| `storageKey` | `string` | localStorage key for persistent dismissal | 'notification-banner-dismissed' |

## HTML Structure

### Basic Banner

```html
<div class="public-good-notification-banner" role="region" aria-labelledby="notification-title">
  <h2 class="public-good-notification-banner__title" id="notification-title">
    Important Notice
  </h2>
  <div class="public-good-notification-banner__content">
    Your settings have been updated successfully.
  </div>
</div>
```

### Dismissible Banner

```html
<div class="public-good-notification-banner public-good-notification-banner--success" 
     role="status" aria-labelledby="success-title">
  <h2 class="public-good-notification-banner__title" id="success-title">
    Success
  </h2>
  <div class="public-good-notification-banner__content">
    Your changes have been saved.
  </div>
  <button class="public-good-notification-banner__close" 
          type="button" aria-label="Dismiss notification">
    <span class="public-good-notification-banner__close-icon" aria-hidden="true">×</span>
  </button>
</div>
```

## CSS Classes

### Base Classes

- `.public-good-notification-banner` - Base notification banner styling
- `.public-good-notification-banner__title` - Title/heading styling
- `.public-good-notification-banner__content` - Content area styling
- `.public-good-notification-banner__close` - Close button styling
- `.public-good-notification-banner__close-icon` - Close icon styling

### Type Modifiers

- `.public-good-notification-banner--success` - Success notification (green)
- `.public-good-notification-banner--warning` - Warning notification (amber)
- `.public-good-notification-banner--error` - Error notification (red)
- `.public-good-notification-banner--info` - Info notification (blue)

### Layout Modifiers

- `.public-good-notification-banner--compact` - Smaller padding variant
- `.public-good-notification-banner--fixed-top` - Fixed positioning at top
- `.public-good-notification-banner--fixed-bottom` - Fixed positioning at bottom

## JavaScript API

### NotificationBanner Class

```typescript
// Constructor
const instance = new NotificationBanner(element: HTMLElement, config?: NotificationBannerConfig)

// Content management
instance.updateContent(text: string): void
instance.updateHtml(html: string): void
instance.getContent(): string
instance.getHtml(): string

// Title management
instance.updateTitle(title: string): void
instance.getTitle(): string

// Type management
instance.setType(type: 'default' | 'success' | 'warning' | 'error' | 'info'): void
instance.getType(): string

// Visibility management
instance.show(): void
instance.hide(): void
instance.dismiss(): void
instance.isVisible(): boolean
instance.isDismissible(): boolean

// Focus management
instance.focus(): void

// CSS class management
instance.addClass(className: string): void
instance.removeClass(className: string): void
instance.hasClass(className: string): boolean

// Element access
instance.getElement(): HTMLElement

// Cleanup
instance.destroy(): void
```

### Helper Functions

```typescript
// Quick notification creators
const successBanner = createSuccessNotification(
  text: string,
  options?: Partial<NotificationBannerOptions>
): HTMLElement

const errorBanner = createErrorNotification(
  text: string,
  options?: Partial<NotificationBannerOptions>
): HTMLElement

const warningBanner = createWarningNotification(
  text: string,
  options?: Partial<NotificationBannerOptions>
): HTMLElement

const infoBanner = createInfoNotification(
  text: string,
  options?: Partial<NotificationBannerOptions>
): HTMLElement

// Temporary notifications
const instance = showTemporaryNotification(
  text: string,
  type?: 'success' | 'warning' | 'error' | 'info',
  duration?: number
): NotificationBanner

// Initialize from markup
const instances = initializeNotificationBanners(
  scope?: Document | HTMLElement
): NotificationBanner[]
```

## Accessibility Features

### ARIA Support

```html
<!-- Alert for errors/warnings -->
<div class="public-good-notification-banner--error" 
     role="alert" aria-labelledby="error-title">
  <h2 id="error-title">Error</h2>
  <div>Please correct the following errors</div>
</div>

<!-- Status for success/info -->
<div class="public-good-notification-banner--success" 
     role="status" aria-labelledby="success-title">
  <h2 id="success-title">Success</h2>
  <div>Changes saved successfully</div>
</div>
```

### Focus Management

```typescript
// Auto-focus for important announcements
const criticalBanner = createNotificationBanner({
  text: 'System maintenance starting in 5 minutes',
  type: 'warning',
  autoFocus: true
});

// Manual focus for programmatic announcements
const programmaticBanner = createNotificationBanner({
  text: 'Form validation complete',
  type: 'success'
});

const instance = new NotificationBanner(programmaticBanner);
instance.focus(); // Announces to screen readers
```

### Keyboard Navigation

- **Tab**: Navigate to close button (if dismissible)
- **Enter/Space** on close button: Dismiss notification
- **Tab** within content: Navigate links and interactive elements

## Usage Patterns

### Form Validation Messages

```typescript
class FormValidator {
  private notificationContainer: HTMLElement;

  constructor(container: HTMLElement) {
    this.notificationContainer = container;
  }

  showValidationErrors(errors: string[]): void {
    // Clear existing notifications
    this.notificationContainer.innerHTML = '';

    if (errors.length === 0) return;

    const errorHtml = errors.length === 1 
      ? errors[0]
      : `<ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>`;

    const banner = createNotificationBanner({
      html: errorHtml,
      type: 'error',
      titleText: 'Please fix the following errors:',
      dismissible: true,
      autoFocus: true
    });

    this.notificationContainer.appendChild(banner);
  }

  showSuccessMessage(message: string): void {
    const banner = createNotificationBanner({
      text: message,
      type: 'success',
      dismissible: true
    });

    this.notificationContainer.appendChild(banner);

    // Auto-dismiss success messages
    new NotificationBanner(banner, {
      autoDismissDelay: 5000
    });
  }
}
```

### System Status Notifications

```typescript
class StatusNotifier {
  private currentBanner?: NotificationBanner;

  showMaintenanceWarning(minutes: number): void {
    this.clearCurrentBanner();

    const banner = createNotificationBanner({
      html: `System maintenance will begin in <strong>${minutes} minutes</strong>. Please save your work.`,
      type: 'warning',
      titleText: 'Scheduled Maintenance',
      classes: 'public-good-notification-banner--fixed-top'
    });

    document.body.insertBefore(banner, document.body.firstChild);

    this.currentBanner = new NotificationBanner(banner, {
      persistDismissal: true,
      storageKey: `maintenance-warning-${Date.now()}`
    });
  }

  showMaintenanceStarted(): void {
    this.clearCurrentBanner();

    const banner = createNotificationBanner({
      text: 'System maintenance is now in progress. Some features may be unavailable.',
      type: 'error',
      titleText: 'Maintenance in Progress',
      classes: 'public-good-notification-banner--fixed-top'
    });

    document.body.insertBefore(banner, document.body.firstChild);

    this.currentBanner = new NotificationBanner(banner);
  }

  private clearCurrentBanner(): void {
    if (this.currentBanner) {
      this.currentBanner.dismiss();
      this.currentBanner = undefined;
    }
  }
}
```

### Cookie Consent Banner

```typescript
class CookieConsent {
  private banner?: NotificationBanner;

  show(): void {
    if (this.hasConsent()) return;

    const bannerElement = createNotificationBanner({
      html: `
        We use cookies to improve your experience. 
        <a href="/privacy">Learn more about our privacy policy</a>.
      `,
      titleText: 'Cookie Notice',
      dismissible: true,
      classes: 'public-good-notification-banner--fixed-bottom'
    });

    document.body.appendChild(bannerElement);

    this.banner = new NotificationBanner(bannerElement, {
      persistDismissal: true,
      storageKey: 'cookie-consent-dismissed'
    });

    // Custom dismiss handler to save consent
    bannerElement.addEventListener('notificationBanner:dismiss', () => {
      this.saveConsent();
    });
  }

  private hasConsent(): boolean {
    return localStorage.getItem('cookie-consent') === 'accepted';
  }

  private saveConsent(): void {
    localStorage.setItem('cookie-consent', 'accepted');
  }
}
```

### Loading State Notifications

```typescript
class LoadingNotifier {
  private loadingBanner?: NotificationBanner;

  showLoading(message: string): void {
    const banner = createNotificationBanner({
      html: `<div style="display: flex; align-items: center; gap: 12px;">
        <div class="spinner" aria-hidden="true"></div>
        ${message}
      </div>`,
      type: 'info',
      role: 'status',
      classes: 'loading-notification'
    });

    document.body.insertBefore(banner, document.body.firstChild);
    this.loadingBanner = new NotificationBanner(banner);
  }

  showSuccess(message: string): void {
    this.hideLoading();

    const successBanner = showTemporaryNotification(message, 'success', 4000);
  }

  showError(message: string): void {
    this.hideLoading();

    const errorBanner = createNotificationBanner({
      text: message,
      type: 'error',
      dismissible: true,
      autoFocus: true
    });

    document.body.insertBefore(errorBanner, document.body.firstChild);
  }

  hideLoading(): void {
    if (this.loadingBanner) {
      this.loadingBanner.dismiss();
      this.loadingBanner = undefined;
    }
  }
}
```

## Events

The component dispatches custom events for integration with other systems:

```typescript
// Listen for banner events
banner.addEventListener('notificationBanner:show', (event) => {
  console.log('Banner shown:', event.detail.banner);
});

banner.addEventListener('notificationBanner:dismiss', (event) => {
  console.log('Banner dismissed:', event.detail.banner);
  // Custom cleanup or analytics
});
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --public-good-color-notification-background: #f0f4f5;
  --public-good-color-notification-border: #d8dde0;
  --public-good-color-notification-accent: #0066cc;
  
  --public-good-color-success: #007f3b;
  --public-good-color-success-background: #edf7ed;
  
  --public-good-color-warning: #f39c12;
  --public-good-color-warning-background: #fffbf0;
  
  --public-good-color-error: #d5281b;
  --public-good-color-error-background: #fdf2f2;
  
  --public-good-color-info: #0066cc;
  --public-good-color-info-background: #e8f4fd;
  
  --public-good-z-index-notification: 1000;
}
```

### Custom Notification Styles

```css
/* Branded notification */
.branded-notification {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-left-color: #ffffff;
}

.branded-notification .public-good-notification-banner__title {
  color: white;
}

.branded-notification .public-good-notification-banner__close {
  color: rgba(255, 255, 255, 0.8);
}

.branded-notification .public-good-notification-banner__close:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Compact mobile notifications */
@media (max-width: 768px) {
  .mobile-compact-notification {
    padding: 8px 12px;
    margin-bottom: 8px;
  }

  .mobile-compact-notification .public-good-notification-banner__title {
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14.4+
- Android Chrome 88+

## Testing

The component includes comprehensive tests covering:

- Component creation with various configurations
- Programmatic content and state management
- Auto-dismiss functionality and event handling
- Accessibility compliance and ARIA support
- Persistent dismissal with localStorage
- Event emission and custom integrations
- Edge cases and error handling

Run tests with: `npm test notification-banner`

## Related Components

- **Error Message**: For inline form validation errors
- **Warning Callout**: For page-level warning content
- **Toast/Alert**: For temporary pop-up notifications (future component)

## Migration Notes

This notification banner component is created new for the Public Good Design System as no equivalent existed in the NHS UK Design System. It follows established patterns for:

- TypeScript implementation with strict types
- Modern CSS with custom properties
- Comprehensive accessibility support
- Event-driven architecture
- Flexible configuration options