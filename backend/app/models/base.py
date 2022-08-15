from pydantic import BaseModel, Field, json, root_validator
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from bson import ObjectId
from typing import List, Optional
from pymongo import MongoClient
from ..utils import to_camel
import os
import datetime
import stringcase


MONGO_URL = os.environ.get('MONGO_URL', "mongodb://localhost:3002/")
APP_NAME = os.environ.get('APP_NAME', 'reward-network-ii')


# todo, make queries asyncronos with motor
client = MongoClient(MONGO_URL)
db = client[APP_NAME]

class PyObjectId(ObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            type='string', examples=["5eb7cf5a86d9755df3a6c593", "5eb7cfb05e32e07750a1756a"])

class SnakeModel(BaseModel):
    class Config:
        alias_generator = stringcase.camelcase
        allow_population_by_field_name = True




class ExtBaseModel(SnakeModel):
    id: Optional[PyObjectId] = Field(default=None, alias='_id')
    created_at: datetime.datetime = datetime.datetime.now()

    @root_validator(pre=True)
    def alias_values(cls, values):
        '''
        Assigning alias in order for swagger docs to display correct schema keys
        '''
        id_name = stringcase.snakecase(cls.__name__) + '_id'
        _values = dict(**values)
        if '_id' in values:
            _values[id_name] = values['_id']
        if 'id' in values:
            _values[id_name] = values['id']
        if id_name in values:
            _values['id'] = values[id_name]
        return _values

    def dict(self, *, by_alias, export=True, **kwargs):
        if export:
            this_dict = super().dict(by_alias=by_alias, **kwargs)
            this_dict.pop('_id')
        else:
            this_dict = super().dict(by_alias=by_alias, **kwargs)
        return this_dict

    def to_bson(self):
        data = self.dict(by_alias=True, exclude_none=True, export=False)
        if ("_id" in data) and (data["_id"] is None):
            data.pop("_id")
        return data

    @classmethod
    def get(cls, id=None, **kwargs):
        query = to_camel(kwargs)
        if id:
            query = {'_id': id, **query}
        res = cls.db().find_one(query)
        if res is not None:
            return cls(**res)

    @classmethod
    def get_many(cls, **kwargs):
        query = to_camel(kwargs)
        res = cls.db().find(query)
        return [cls(**r) for r in res]

    @classmethod
    def db(cls, collection=None):
        if collection is None:
            collection = cls.__name__.lower()
        return db[collection]

    def flush(self):
        try:
            if not self.id:
                id = self.db().insert_one(self.to_bson()).inserted_id
                self.id = id
                id_name = stringcase.snakecase(self.__class__.__name__) + '_id'
                setattr(self, id_name, id)
            else:
                self.db().update_one({'_id': self.id}, {"$set": self.to_bson()})
        except:
            name = self.__class__.__name__
            raise HTTPException(status_code=409, detail=f"Failed to upsort {name}. Probably a constraint was violated.")
        return self

    @classmethod
    def reset(cls):
        cls.db().drop()


json.ENCODERS_BY_TYPE[ObjectId]=str
