/**
 * Created by LuoQuan on 2019/6/20.
 */
import store from 'store';

export default {
    /*
     保存user
     */
    saveUser(user){
        store.set("user", user);
    },

    /*
     读取user
     */
    getUser(){
        return store.get("user") || {};
    },

    /*
     删除user
     */
    removeUser(){
        store.remove("user");
    }
}