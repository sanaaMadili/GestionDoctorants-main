package com.mycompany.myapp.charts;

public class CountPubByType {
    private String type;
    private Long count;

    public CountPubByType(String type, Long count) {
        this.type = type;
        this.count = count;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "CountPubByType{" +
            "type='" + type + '\'' +
            ", count=" + count +
            '}';
    }
}
