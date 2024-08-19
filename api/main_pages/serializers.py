from rest_framework import serializers
from main_pages.models import Notebook, Subject
import uuid

class NotebookListSerializer(serializers.ListSerializer):
    def __init__(self, instances=None, *args, **kwargs):
        new_instances = dict()
        if instances:
            for instace in instances:
                new_instances[instace.id] = instace
            instances = new_instances
        super().__init__(instances, *args, **kwargs)
    
    def update(self, instances, validated_data):
        final_instances = list()
        for obj_data in validated_data:
            if instance := instances.get(uuid.UUID(obj_data['id']), None):
                final_instances.append(instance)
                self.child.update(instance, obj_data)
        return final_instances
    
    def create(self, validated_data):
        instances = list()
        id_mapping = dict()
        for item_data in validated_data:
            instance, id_conversion = self.child.create(item_data)
            instances.append(instance)
            id_mapping.update(id_conversion)
        return instances, id_mapping


class SubjectSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64, required=True)
    name = serializers.CharField(max_length=32, default='New subject')
    color = serializers.CharField(max_length=32, default='white')
    notebook = serializers.PrimaryKeyRelatedField(queryset=Notebook.objects.all(), required=False)
    
    class Meta:
        list_serializer_class = NotebookListSerializer
        
    def update(self, instance, validated_data):
        super().is_valid()
        validated_data['id'] = instance.id
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
    
    def create(self, validated_data):
        original_id = validated_data.get('id')
        validated_data['id'] = uuid.uuid4()
        instance = Subject.objects.create(**validated_data)
        return instance, {original_id: str(validated_data['id'])}
