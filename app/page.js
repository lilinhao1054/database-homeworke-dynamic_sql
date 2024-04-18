'use client'
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, Table } from "antd";
import { useState } from "react";
import { useRequest } from "ahooks";
import { pageQueryStudent } from "@/lib/api/student";
import "./globals.css";
import TextArea from "antd/es/input/TextArea";

const CheckedLabel = (name, label) => (
  <Form.Item name={`check_${name}`} className="m-0" valuePropName="checked">
    <Checkbox>
      {label}
    </Checkbox>
  </Form.Item>
)

const solveFilter = (filter) => {
  let newFilter = {};
  let needKeys = Object.keys(filter)
    .filter(key => key.startsWith('check') && filter[key])
    .map(key => key.substring(key.indexOf('_') + 1));
  for (let key in filter) {
    if (needKeys.includes(key) && filter[key]) {
      if (key === 'age') {
        if (!filter.age.min || !filter.age.max) break;
      }
      newFilter[key] = filter[key];
    }
  }
  return newFilter;
}

const AgeInput = ({ value = {}, onChange }) => {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const triggerChange = (changedValue) => {
    onChange?.({
      min,
      max,
      ...value,
      ...changedValue,
    });
  };
  const handleMin = (value) => {
    setMin(value);
    triggerChange({ min: value });
  }
  const handleMax = (value) => {
    setMax(value);
    triggerChange({ max: value });
  }
  return <div>
    <InputNumber min={0} value={value.min || min} onChange={handleMin} /> 至 <InputNumber min={value.min || min} value={value.max || max} onChange={handleMax} />
  </div>
}

const Page = () => {
  const [form] = Form.useForm();

  const { data, loading, refresh } = useRequest(() =>
    pageQueryStudent(sql)
  );


  const onFinish = () => {
    refresh();
  };

  const onReset = () => {
    form.resetFields();
    setSql('select * from student');
  };

  const columns = [
    {
      title: "学号",
      dataIndex: "snum",
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "sname",
      align: "center",
    },
    {
      title: "年龄",
      dataIndex: "age",
      align: "center",
    },
    {
      title: "性别",
      dataIndex: "sex",
      align: "center",
    },
    {
      title: "班级",
      dataIndex: "class",
      align: "center",
    },
    {
      title: "系别",
      dataIndex: "department",
      align: "center",
    },
    {
      title: "地址",
      dataIndex: "address",
      align: "center",
    },
  ];

  const handleValueChange = (_, allValues) => {
    const filter = solveFilter(allValues);
    let sql = '';
    const keys = Object.keys(filter);
    if (keys.length !== 0) {
      sql = 'select * from student where 1 = 1';
    }
    if (keys.includes('snum')) sql += ` and (snum like '${filter.snum}%')`;
    if (keys.includes('sname')) sql += ` and (sname like '${filter.sname}%')`;
    if (keys.includes('sex')) sql += ` and (sex = '${filter.sex}')`;
    if (keys.includes('address')) sql += ` and (address like '${filter.address}%')`;
    if (keys.includes('class')) sql += ` and (class like '${filter.class}%')`;
    if (keys.includes('department')) sql += ` and (department like '${filter.department}%')`;
    if (keys.includes('age')) sql += ` and (age >= ${filter.age.min}) and (age <= ${filter.age.max})`;
    sql = sql.replace(/1\s*=\s*1\s*and\s*/, '');
    setSql(sql === '' ? 'select * from student' : sql);
  }

  const [sql, setSql] = useState('select * from student');

  return (
    <div className="flex flex-col gap-4 p-5">
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValueChange}
        className="bg-white w-full rounded-lg p-4"
      >
        <div className="flex mb-4">
          <div className="flex items-center text-lg">
            筛选搜索
          </div>
          <Button className="ml-auto" htmlType="button" onClick={onReset}>
            重置
          </Button>
          <Button className="ml-4" type="primary" htmlType="submit">
            查询结果
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col>
            <Form.Item name="snum" label={CheckedLabel("snum", "学号")}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="class" label={CheckedLabel("class", "班级")}>
              <Input />
            </Form.Item>
          </Col>
          <Col className="flex gap-2">
            <Form.Item name="sname" label={CheckedLabel("sname", "姓名")}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="department" label={CheckedLabel("department", "系别")}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="age" label={CheckedLabel("age", "年龄")}>
              <AgeInput />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="address" label={CheckedLabel("address", "地址")}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="sex" label={CheckedLabel("sex", "性别")}>
              <Select
                style={{ width: 120 }}
                options={[
                  {
                    value: '男',
                    label: '男',
                  },
                  {
                    value: '女',
                    label: '女',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="flex flex-col bg-white w-full rounded-lg p-4 gap-2">
        <div className="flex items-center text-lg">
          动态SQL
        </div>
        <TextArea disabled value={sql} className="text-lg" />
      </div>

      <Table
        bordered
        pagination={false}
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
};

export default Page;
