import OrderService from '../../services/orders.service';
import { FETCH_ORDER_ROLES } from '../action.type';
import { GET_ORDER_ROLES } from '../getters.type';
import { SET_ORDER_ROLES } from '../mutation.type';


const getDefaultState = () => {
    return {
        orderRoles:[]
    };
};

const state = getDefaultState();

const getters = {
    [GET_ORDER_ROLES](state) {
        return state.orderRoles;
    }
};

const mutations = {
    [SET_ORDER_ROLES](state, { data }) {
        state.orderRoles = data && data.permissions && data.permissions.length ? data.permissions.map(p=>(p.slug)):[];
    }
};

const actions = {
    [FETCH_ORDER_ROLES]({ commit }, options={}) {
        options = options || {};
        options.params = options.params || {};
        return OrderService.fetchOrderUserRoles(options).then(res => {
            commit(SET_ORDER_ROLES, {data: res.data});
            return res.data;
        }).catch(err=>{
            commit(SET_ORDER_ROLES, {data: []});
            return [];
        });
    }
};
export function createOrderStore() {
    return {
        state: getDefaultState(),
        actions,
        mutations,
        getters
    };
}
