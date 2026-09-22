from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.market_orders import place_market_order
from src.limit_orders import place_limit_order
from src.Advanced.oco import place_oco_order
from src.Advanced.twap import place_twap_order

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MarketOrderRequest(BaseModel):
    symbol: str
    side: str
    quantity: float


class LimitOrderRequest(BaseModel):
    symbol: str
    side: str
    quantity: float
    price: float


class OcoOrderRequest(BaseModel):
    symbol: str
    side: str
    quantity: float
    take_profit_price: float
    stop_loss_price: float


class TwapOrderRequest(BaseModel):
    symbol: str
    side: str
    total_quantity: float
    num_chunks: int
    interval_seconds: int


@app.get("/")
def root():
    return {"message": "Trading bot API is running"}


@app.post("/place-market-order")
def market_order_endpoint(order: MarketOrderRequest):
    result = place_market_order(order.symbol, order.side, order.quantity)
    return {"success": result is not None, "order": result}


@app.post("/place-limit-order")
def limit_order_endpoint(order: LimitOrderRequest):
    result = place_limit_order(order.symbol, order.side, order.quantity, order.price)
    return {"success": result is not None, "order": result}


@app.post("/place-oco-order")
def oco_order_endpoint(order: OcoOrderRequest):
    tp_order, sl_order = place_oco_order(
        order.symbol, order.side, order.quantity,
        order.take_profit_price, order.stop_loss_price
    )
    return {
        "success": tp_order is not None and sl_order is not None,
        "take_profit_order": tp_order,
        "stop_loss_order": sl_order,
    }


@app.post("/place-twap-order")
def twap_order_endpoint(order: TwapOrderRequest):
    # Note: this runs synchronously, so the API call will take
    # num_chunks * interval_seconds to fully return.
    place_twap_order(
        order.symbol, order.side, order.total_quantity,
        order.num_chunks, order.interval_seconds
    )
    return {"success": True, "message": "TWAP execution complete"}


@app.get("/logs")
def get_logs():
    try:
        with open("bot.log", "r") as f:
            lines = f.readlines()
        return {"logs": lines[-50:]}
    except FileNotFoundError:
        return {"logs": []}