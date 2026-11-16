
import { test } from '@playwright/test';
import { DeliveryPage } from '../pages/delivery.page';

test.describe('Delivery creation', () => {
  let deliveryPage: DeliveryPage;

  test.beforeEach(async ({ page }) => {
    deliveryPage = new DeliveryPage(page);

    await deliveryPage.navigate();

    await deliveryPage.login(
      'business1@sandbox.test',
      'Password123!'
    );
  });

  test('should validate required fields when creating a delivery', async () => {
    await deliveryPage.submitDelivery();

    await deliveryPage.verifyRequiredFieldErrors();
  });

  test('should successfully create a delivery with valid details', async () => {
    const deliveryData = {
      pickupName: 'Oyewole',
      pickupPhone: '09038054088',
      pickupAddress: 'Lagos Nigeria',
      packageDescription: 'Take this test package',
      dropoffName: 'Peter',
      dropoffPhone: '07077889382',
      dropoffAddress: 'London, UK',
      packageWeight: '0.7'
    };

    await deliveryPage.fillDeliveryForm(deliveryData);

    await deliveryPage.submitDelivery();

    await deliveryPage.verifyDeliverySuccess();
  });
});
