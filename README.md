# visitPharmacy Application

## Summary

## Strategy

The user (pain points and demographics, c2c)
The user's needs and pain points
The user demographics and characteristics (age, occupation, literacy, expectation)
The value proposition
The site's objectives (i.e, the organisation's needs)

Is it B2B or B2C? Why is so?
What are different market segments?
What are the demographics like for each segment?
Age
Occupation
Educational Level
IT Literacy Level
Implications of the above
What are the pain points for each segment?
Express each pain point as a user story.
Are there any special considerations?
How can you add more value?

This app is designed to target B2C customers -

Value-added services

### Needs and pain points

- COVID-19 has strained Singapore's hospital system. For many citizens, self-care through pharmacy store has become more viable, especially for the fear of virus infection at hot spots - clinics and hospitals.

Basic user

- Google allows for pharmacy location search but its search return also includes non-pharmacy results. So this app provide geo location of registered pharmacy with the Singapore government.

Super user (high edu and it literacy)

- With many people visiting pharmacy, some might already know what drug they want to purchase, but not sure it could be purchased over the counter.

- Some people might prefer e-pharmacy to get the drugs to deliver to their door step. However, there are many illegal online pharmacies, which might cause misuse of drugs or overdose. They need a list of HSA registered e-pharmacy.

- In addition, some people might want to know the registered pharmacist at certain drug store and also to know their experience before consulting them

## Font and color

The app should adopt warm color - gives uses some hope, especially for those who are ill.

The app will also adopt a more offcial them, not too fancy color or front.

### User Story

Basic user:

- As I user who works from home, I want to get to nearby pharmacy to get drugs instead of going to clinics or hospitals.

- As a user, I want to search for pharmacy in different areas, so that I could make recommendations to my my parents.

Super user:

- As a user, I know what drugs need, but I am not sure if it can be purchased over the counter (OTC) , I want to check if the drug is OTC or prescription-based, in addition to a brief description of the drug.

- As a user, I also want to know the name of the registered pharmacist, because I want to get a brief consultation from him/her, instead of ramdom picking up drugs myself.

- As a user, I might not want to travel far, so I want to get pharmacist consultation online and get the drugs delivered to home (e-phaemacy).

## Main features

Nearby pharmacy store
Search pharmacy store
Search pharmacy drugs
See a list of HSA registered e-pharmacy

At desk, the 3 buttons should appear on top.
In mobile modes, the 3 buttons should appear below like wechat style.

/ask users for access control in current location
//find nearest pharmacy (Djastra algorithm) and check if the drug is OTC/prescription
//tell them who is the license pharmacist in charge
//remind them to bring NRIC to get pharmacy drugs (bring nric to see pharmacist)

## DataSets

1. [GeoJson data from data.gov.sg](https://data.gov.sg/dataset/retail-pharmacy-locations?resource_id=ae46281d-8ee1-4fa3-ab07-03ab409946d8)
   This allows us to plot the locations of the pharmacies on the map, and we are also able to identifiy its postal code.

2. [Liscensed pharmacists from data.gov.sg](https://data.gov.sg/dataset/listing-of-licensed-pharmacies);

3. [List of registered drugs in Singapore from ](https://data.gov.sg/dataset/listing-of-registered-therapeutic-products)

4. ATC Code level 1 and level 2 list for the drugs
   As the

Chart
source: WHO

5. List of available e-pharmacy services
   https://www.straitstimes.com/singapore/health/first-hsa-registered-e-pharmacy-in-singapore-launched

https://www.mobihealthnews.com/news/asia/hyphens-pharma-officially-launches-first-hsa-approved-e-pharmacy-singapore

https://www.raffleshealth.com/pharmacy.html

https://www.singhealth.com.sg/patient-care/patient-visitor-info/medicine-delivery-service

https://www.sgh.com.sg/patient-care/visiting-specialist/medication-delivery-singapore-general-hospital
