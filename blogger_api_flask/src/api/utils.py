def instance_to_dict(instance, **kwargs):
    selected = kwargs.get("selected")
    
    if selected and isinstance(selected, tuple):
        return {
            key: getattr(instance, key)
            for key in selected
        }
    else:
        return {
            column.name: getattr(instance, column.name)
            for column in instance.__table__.columns
        }