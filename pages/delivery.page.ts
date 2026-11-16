
import { Page, Locator, expect } from '@playwright/test';

interface DeliveryData {
  pickupName: string;
  pickupPhone: string;
  pickupAddress: string;
  packageDescription: string;
  dropoffName: string;
  dropoffPhone: string;
  dropoffAddress: string;
  packageWeight: string;
}

export class DeliveryPage {
  readonly page: Page;

  // Login locators
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginSubmit: Locator;

  // Delivery form locators
  readonly deliverySubmit: Locator;
  readonly pickupName: Locator;
  readonly pickupPhone: Locator;
  readonly pickupAddress: Locator;
  readonly dropoffName: Locator;
  readonly dropoffPhone: Locator;
  readonly dropoffAddress: Locator;
  readonly packageDescription: Locator;
  readonly packageWeight: Locator;

  // Validation messages
  readonly pickupNameError: Locator;
  readonly pickupPhoneError: Locator;
  readonly packageDescriptionError: Locator;
  readonly packageWeightError: Locator;

  // Success message
  readonly deliverySuccess: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginEmail = page.getByTestId('login-email');
    this.loginPassword = page.getByTestId('login-password');
    this.loginSubmit = page.getByTestId('login-submit');

    this.deliverySubmit = page.getByTestId('delivery-submit');

    this.pickupName = page.getByTestId('pickup-name');
    this.pickupPhone = page.getByTestId('pickup-phone');
    this.pickupAddress = page.getByTestId('pickup-address');

    this.dropoffName = page.getByTestId('dropoff-name');
    this.dropoffPhone = page.getByTestId('dropoff-phone');
    this.dropoffAddress = page.getByTestId('dropoff-address');

    this.packageDescription = page.getByTestId('package-description');
    this.packageWeight = page.getByTestId('package-weight');

    this.pickupNameError = page.getByTestId('pickup-name-error');
    this.pickupPhoneError = page.getByTestId('pickup-phone-error');
    this.packageDescriptionError = page.getByTestId('package-description-error');
    this.packageWeightError = page.getByTestId('package-weight-error');

    this.deliverySuccess = page.getByTestId('delivery-success');
  }

  async navigate(): Promise<void> {
    await this.page.goto('http://localhost:4000/');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginSubmit.click();
  }

  async submitDelivery(): Promise<void> {
    await this.deliverySubmit.click();
  }

  async verifyRequiredFieldErrors(): Promise<void> {
    await expect(this.pickupNameError).toContainText(
      'Pickup name is required'
    );

    await expect(this.pickupPhoneError).toBeVisible();
    await expect(this.packageDescriptionError).toBeVisible();
    await expect(this.packageWeightError).toBeVisible();
  }

  async fillDeliveryForm(data: DeliveryData): Promise<void> {
    await this.pickupName.fill(data.pickupName);
    await this.pickupPhone.fill(data.pickupPhone);
    await this.pickupAddress.fill(data.pickupAddress);

    await this.packageDescription.fill(data.packageDescription);

    await this.dropoffName.fill(data.dropoffName);
    await this.dropoffPhone.fill(data.dropoffPhone);
    await this.dropoffAddress.fill(data.dropoffAddress);

    await this.packageWeight.fill(data.packageWeight);
  }

  async verifyDeliverySuccess(): Promise<void> {
    await expect(this.deliverySuccess).toBeVisible();
  }
}
