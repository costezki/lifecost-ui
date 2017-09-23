import sys
import json

from model.learnvest_mash_projection import LearnVestLinearModel
from model.current_static_projection import SimpleLinearModel

modelId = sys.argv[1]

modelData = json.loads(sys.argv[2])

result = None

if modelId == "learnvest":
    _one_time_items = {
        "primary_residence": int(modelData['primary_residence']),
        "secondary_residence": int(modelData['secondary_residence']),
        "vehicle": int(modelData['vehicle']),
        "retirement_cost": int(modelData['retirement_cost'])
    }

    _recursive_items_yearly = {
        "vehicle_maintenance": int(modelData['vehicle_maintenance']),
        "clothing": int(modelData['clothing']),
        "travel": int(modelData['travel']),
        "free_time_hobbies": int(modelData['free_time_hobbies'])
    }

    _other_parameters = {
        "children": int(modelData['children']),
        "parents": 2,
        "retirement_age": int(modelData['life_span']) - int(modelData['age']),
        "age": int(modelData['age']),
        "life_span": int(modelData['life_span']),
        "inflation_rate": float(modelData['inflation_rate']),
    }

    _child_related_recursive_items_yearly = {
        "child_care": int(modelData['child_care']),
        "pocket_money": 0
    }

    _child_related_one_time_items = {"tuition_fee": int(modelData['tuition_fee'])}
    _parent_related_one_time_items = {"nursing_care": int(modelData['nursing_care'])}

    result = LearnVestLinearModel(_one_time_items, _recursive_items_yearly, _child_related_recursive_items_yearly,
                                  _child_related_one_time_items, _parent_related_one_time_items,
                                  _other_parameters["inflation_rate"], _other_parameters["life_span"],
                                  _other_parameters["age"], _other_parameters["retirement_age"],
                                  _other_parameters["children"]).to_ui()
elif modelId == "simple-linear":
    input_categories = [int(modelData['housing']), int(modelData['utilities']), int(modelData['food']),
                        int(modelData['transportation']), int(modelData['clothing']), int(modelData['personal']),
                        int(modelData['education']), int(modelData['savings'])]

    result = SimpleLinearModel(float(modelData['inflation_rate']), int(modelData['life_span']),
                               int(modelData['age']), {k: 0 for k in input_categories}).to_ui()

print(json.dumps(result))
