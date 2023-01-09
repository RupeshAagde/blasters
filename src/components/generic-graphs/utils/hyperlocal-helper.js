export const RTO_CLOSE = [
    "delivery_done",
    "bag_lost","rto_initiated",
    "rto_in_transit",
    "rto_bag_delivered",
    "refund_initiated",
    "refund_acknowledged",
    "refund_completed",
    "rto_bag_accepted",
    "credit_note_generated",
    "return_bag_lost",
    "return_bag_picked", 
    "return_bag_in_transit",
    "return_bag_out_for_delivery",
    "return_bag_delivered",
    "return_bag_accepted",
    "return_request_cancelled"
];
export const ACTIVE_STATUS = [
    "assigning_dp",
    "ready_for_dp_assigning",
    "dp_not_assigned",
    "dp_assigned",
    "bag_packed",
    "bag_not_picked",
    "bag_picked",
    "handed_over_to_dg",
    "out_for_delivery",
    "return_initiated",
    "return_DP_not_assigned",
    "return_DP_assigned",
    "return_bag_not_picked",
    "return_cancelled_at_dp"
];
export const hyperlocalHelpers = {
    hyperlocalIsClose(status) {
        if(!status) {
            return false;
        }
        if(RTO_CLOSE.includes(status.toLowerCase())) return true;
        return false;
    }
}