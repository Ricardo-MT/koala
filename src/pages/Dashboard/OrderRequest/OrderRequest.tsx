import React from "react";
import { useState, useContext, useCallback } from "react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal";
import { types, ITYPE } from "../../../models/Drink/drink";
import appApi from "../../../utils/api/config";
import OrderEndpoints from "../../../utils/api/order.endpoints";
import { NotificationContext } from "../../../utils/contexts/notificationContext";
import { isNumber } from "../../../utils/validators/Validators";
import styles from './OrderRequest.module.css';


const OrderRequestContainer : React.FunctionComponent = () => {
    const {setNotification} = useContext(NotificationContext);
    const [orderRequestDrink, setOrderRequestDrink] = useState<ITYPE>();

    const requestOrder = useCallback((user: number, stock: ITYPE)=>{
        const orderEndpoints = new OrderEndpoints(appApi);
            orderEndpoints.requestDrink(user, stock).then(response=>{
                if(response.message){
                    setNotification({type: 'success', text: response.message})
                }
            }).catch(err=>{
                if(err.response.data.message){
                    setNotification({type: 'error', text: err.response.data.message})
                }
            })
    }, [setNotification]);

    return <div className={styles.createOrdersPanelContainer}>
        <h2>Order your stock here</h2>
        {
            types.map(
                stock => <Button 
                            key={`orderButton${stock}`}
                            text={`${stock}+`}
                            action={()=>{
                                setOrderRequestDrink(stock);
                            }} />)
        }
        <Modal
            open={orderRequestDrink!=undefined} 
            onClose={()=> setOrderRequestDrink(undefined)}>
            <OrderRequestForm
                stock={orderRequestDrink!}
                onSend={(user: number)=>{
                    requestOrder(user, orderRequestDrink!);
                    setOrderRequestDrink(undefined);
                }}
                onCancel={()=>setOrderRequestDrink(undefined)}
            />
        </Modal>
    </div>
}
export default OrderRequestContainer;

type OrderRequestFormProps = {
    stock: ITYPE,
    onSend: (user: number)=>void,
    onCancel: ()=>void,
}
const OrderRequestForm : React.FunctionComponent<OrderRequestFormProps> = ({stock, onSend, onCancel,}) => {
    const [user, setUser] = useState<string>();
    const [userError, setUserError] = useState<string>();

    const validateSendRequest = useCallback((value?: string)=>{
        if(!value){
            setUserError('Required field');
            return false;
        }
        if(!isNumber(Number(value))){
            setUserError('Must be a number');
            return false;
        }
        return true;
    }, [user, setUser, userError, setUserError])

    return (
        <React.Fragment>
            <div className={styles.createOrderForm} >
                <h3>Requesting stock {stock}</h3>
                <span>
                    <p>Type the user and hit send to request a stock order</p>
                </span>
                <Input 
                    value={user} 
                    setValue={setUser}
                    error={userError}
                    type="number" 
                    name="user"
                />
                <Button
                    text={'Send'}
                    disabled={!user}
                    action={()=>{
                        if(validateSendRequest(user)){
                            onSend(Number(user));
                        }
                    }}
                />
            </div>
        </React.Fragment>
    )
}
