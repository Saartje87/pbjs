# Attribute

###attr
###val
###serializeForm


Attribute
=========

### attr

Set or receives the value of attributes.

# Code:


> Receiving the class of the element
>> $(el).attr('class')

> Sets the attribute "name" to "nice"
>> $(el).attr('name', 'nice') 



###val

Define or returns the value of an element.

# Code:

> Gets the value of the element
>> $(el).val()

> Puts the word "foobar" into the value of the element
>> $(el).val('foobar')



###serializeForm

Serialize a form into an object - allows simple transer via an AJAX request.

> $.serializeForm()