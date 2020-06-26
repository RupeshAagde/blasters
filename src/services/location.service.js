import ApiService from './api.service';
import URLS from './domain.service';

const LocationService = {
    getCountries() {
        let axiosOption = Object.assign(
            {},
            { params: { location_type: 'country' } }
        );
        return ApiService.get(URLS.LOCATIONS(), axiosOption);
    },
    getStates(country_id) {
        let axiosOption = Object.assign(
            {},
            { params: { location_type: 'state', id: country_id } }
        );
        return ApiService.get(URLS.LOCATIONS(), axiosOption);
    },
    getCities(country_id) {
        let axiosOption = Object.assign(
            {},
            { params: { location_type: 'city', id: country_id } }
        );
        return ApiService.get(URLS.LOCATIONS(), axiosOption);
    }
};
export default LocationService;
