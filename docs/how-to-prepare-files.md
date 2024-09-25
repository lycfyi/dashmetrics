# How to Prepare Files

## Downloading CSV Files from Stripe

To download CSV files containing payment reports from Stripe, follow these steps:

1. Log in to your Stripe Dashboard.
2. Navigate to the Payments page.
3. Click on the "Export" button in the top right corner of the page.
4. In the Export view, customize your report by selecting:

   - Your preferred time zone
   - Date range
   - Desired columns
   - Type of payments (Successful Payments, Refunded Payments, Uncaptured Payments, or All Payments)

5. To include fees in your report:

   - Select "Custom" under the "Column" section
   - Ensure that the "Fee" column is checked

6. After configuring your preferences, click the export button to download the CSV file to your device.

Note: The fees included in this export will be a sum of both standard Stripe processing fees and any application fees charged by connected platforms. The report doesn't currently split these fees into separate columns.

This method allows you to access historical transaction data and customize the report to your specific needs. The CSV format makes it easy to import the data into spreadsheet software or other analysis tools for further processing.

For more information, refer to [Stripe's official support page on exporting payment reports](https://support.stripe.com/questions/exporting-payment-reports).
