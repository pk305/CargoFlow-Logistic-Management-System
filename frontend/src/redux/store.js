import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import bookingSlice from './slices/bookingSlice'
import systemSlice from './slices/systemSlice'
import companySlice from './slices/companySlice'
import contactSlice from './slices/contactSlice'
import locationSlice from './slices/locationSlice'
import positionSlice from './slices/positionSlice'
import invoiceSlice from './slices/invoiceSlice'
import templateSlice from './slices/templateSlice'
import tempdocSlice from './slices/tempdocSlice'
import setupSlice from './slices/setupSlice'
import reportSlice from './slices/reportSlice'
import searchSlice from './slices/searchSlice'
import userSlice from './slices/userSlice'
import workorderSlice from './slices/workorderSlice'
import financialSlice from './slices/financialSlice'
import currencySlice from './slices/currencySlice'
import ledgerAccountSlice from './slices/ledgerAccountSlice'
import profitCenterSlice from './slices/profitCenterSlice'
import taxcodeSlice from './slices/taxcodeSlice'
import finitemSlice from './slices/finitemSlice'
import timezoneSlice from './slices/timezoneSlice'
import branchSlice from './slices/branchSlice'
import vehicleSlice from './slices/vehicleSlice'
import operationSlice from './slices/operationSlice'
import quotationSlice from './slices/quotationSlice'
import finpointSlice from './slices/finpointSlice'
import ibanSlice from './slices/ibanSlice'
import findocSlice from './slices/findocSlice'
import driverSlice from './slices/driverSlice'
import citySlice from './slices/citySlice'
import gldocSlice from './slices/gldocSlice'
import planningSlice from './slices/planningSlice'
import hscodeSlice from './slices/hscodeSlice'
import accountSlice from './slices/accountSlice'
import mailSlice from './slices/mailSlice'

export default configureStore({
  reducer: {
    system: systemSlice,
    auth: authSlice,
    user: userSlice,
    booking: bookingSlice,
    company: companySlice,
    contact: contactSlice,
    location: locationSlice,
    position: positionSlice,
    invoice: invoiceSlice,
    template: templateSlice,
    tempdoc: tempdocSlice,
    setup: setupSlice,
    report: reportSlice,
    search: searchSlice,
    workorder: workorderSlice,
    financial: financialSlice,
    currency: currencySlice,
    profitCenter: profitCenterSlice,
    ledger: ledgerAccountSlice,
    taxcode: taxcodeSlice,
    finitem: finitemSlice,
    timezone: timezoneSlice,
    branch: branchSlice,
    vehicle: vehicleSlice,
    operation: operationSlice,
    quotation: quotationSlice,
    finpoint: finpointSlice,
    iban: ibanSlice,
    findoc: findocSlice,
    driver: driverSlice,
    city: citySlice,
    gldoc: gldocSlice,
    planning: planningSlice,
    hscode: hscodeSlice,
    account: accountSlice,
    mail: mailSlice,
  },
})
