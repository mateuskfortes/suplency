from rest_framework import serializers
from main_pages.models import Notebook, Subject
import uuid

class SubjectListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        instances = []
        id_mapping = {}
        for item_data in validated_data:
            instance, id_conversion = self.child.create(item_data)
            instances.append(instance)
            id_mapping.update(id_conversion)
        return instances, id_mapping


class SubjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    name = serializers.CharField(max_length=32)
    
    class Meta:
        list_serializer_class = SubjectListSerializer
    
    def update(self, instance, validated_data):
        validated_data['id'] = instance.id
        instance.name = validated_data.get('name', None)
        instance.save()
        return instance
    
    def create(self, validated_data):
        original_id = validated_data.get('id')
        validated_data['id'] = uuid.uuid4()
        instance = Subject.objects.create(**validated_data)
        return instance, {original_id: str(validated_data['id'])}

'''
from main_pages.serializers import SubjectSerializer
cont = [{'id': -1, 'name': 'ola'}, {'id': -2, 'name': 'tchau'}]
res = SubjectSerializer(data=cont, many=True)
res.is_valid() 
res.save()
'''