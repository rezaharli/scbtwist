package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
)

type TurbineMaster struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            bson.ObjectId ` bson:"_id" , json:"_id" `
	TurbineId     string
	TurbineName   string
	Project       string
	Latitude      float64
	Longitude     float64
	Elevation     float64
	CapacityMW    float64
}

func (m *TurbineMaster) New() *TurbineMaster {
	m.ID = bson.NewObjectId()
	return m
}

func (m *TurbineMaster) RecordID() interface{} {
	return m.ID
}

func (m *TurbineMaster) TableName() string {
	return "ref_turbine"
}

type ProjectMaster struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            bson.ObjectId ` bson:"_id" , json:"_id" `
	ProjectId     string
	ProjectName   string
	TotalPower    float64
	Latitude      float64
	Longitude     float64
}

func (m *ProjectMaster) New() *ProjectMaster {
	m.ID = bson.NewObjectId()
	return m
}

func (m *ProjectMaster) RecordID() interface{} {
	return m.ID
}

func (m *ProjectMaster) TableName() string {
	return "ref_project"
}
